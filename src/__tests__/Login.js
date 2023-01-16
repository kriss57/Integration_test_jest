/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";


//Étant donné que je suis un utilisateur sur la page de connexion
describe("Given that I am a user on login page", () => {
  //Quand je ne remplis pas les champs et que je clique sur le bouton Employé Se connecter
  describe("When I do not fill fields and I click on employee button Login In", () => {
    //Ensuite, il devrait rendre la page de connexion
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  //Lorsque je remplis des champs dans un format incorrect et que je clique sur le bouton de l'employé
  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    //Ensuite, il devrait rendre la page de connexion
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-employee");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });
  //Lorsque je remplis les champs dans le bon format et que je clique sur le bouton de l'employé
  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    //Ensuite, je devrais être identifié en tant qu'employé dans l'application
    test("Then I should be identified as an Employee in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      const inputEmailUser = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-employee");

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
    //Il devrait afficher la page Facture
    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

//Étant donné que je suis un utilisateur sur la page de connexion
describe("Given that I am a user on login page", () => {
  //Quand je ne remplis pas les champs et que je clique sur le bouton admin Se connecter
  describe("When I do not fill fields and I click on admin button Login In", () => {
    //Ensuite, il devrait rendre la page de connexion
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      expect(inputEmailUser.value).toBe("");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      expect(inputPasswordUser.value).toBe("");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  //Lorsque je remplis des champs dans un format incorrect et que je clique sur le bouton d'administration Connexion
  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    //Ensuite, il devrait rendre la page de connexion
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
      expect(inputPasswordUser.value).toBe("azerty");

      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });
  //Lorsque je remplis les champs dans le bon format et que je clique sur le bouton admin Se connecter
  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    //Ensuite, je devrais être identifié en tant qu'administrateur RH dans l'application
    test("Then I should be identified as an HR admin in app", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };

      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
      expect(inputEmailUser.value).toBe(inputData.email);

      const inputPasswordUser = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPasswordUser, {
        target: { value: inputData.password },
      });
      expect(inputPasswordUser.value).toBe(inputData.password);

      const form = screen.getByTestId("form-admin");

      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      let PREVIOUS_LOCATION = "";

      const store = jest.fn();

      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      const handleSubmit = jest.fn(login.handleSubmitAdmin);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
    //Il devrait rendre la page du tableau de bord RH
    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  });
});

// ----------------------------------------------- //
// --------------------------------------------- //
describe('login', () => {
  // devrait appeler la méthode de connexion au store et stocker le jeton jwt dans le stockage local
  test('should call the store login method and store the jwt token in local storage', async () => {
    document.body.innerHTML = LoginUI();

    //localStorage doit être rempli avec des données de formulaire
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });

    //simuler la navigation pour la tester
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    let PREVIOUS_LOCATION = "";

    const store = {
      login: jest.fn().mockResolvedValue({ jwt: 'fake-jwt-token' }),
    };


    const user = { email: 'foo@bar.com', password: 'password' };

    const login = new Login({
      document, localStorage, onNavigate,
      PREVIOUS_LOCATION,
      store,
    });

    await login.login(user);
    expect(store.login).toHaveBeenCalledWith(JSON.stringify({ email: user.email, password: user.password }));
    expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'fake-jwt-token');
  });

  // doit retourner null si aucun magasin n'est fourni
  test('should return null if no store is provided', async () => {
    document.body.innerHTML = LoginUI();

    // localStorage doit être rempli avec des données de formulaire
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

    // simuler la navigation pour la tester
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    let PREVIOUS_LOCATION = "";

    const login = new Login({
      document, localStorage, onNavigate,
      PREVIOUS_LOCATION,
      store: null,
    });

    const result = await login.login({});
    expect(result).toBeNull();
  });
});

// --------------------------------//
//---- test creatUser 80-96 ---- //
describe('createUser', () => {
  let store, login

  beforeEach(() => {
    document.body.innerHTML = LoginUI();

    store = {
      users: jest.fn().mockReturnThis(),
      create: jest.fn()
    }

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

    // simuler la navigation pour la tester
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    let PREVIOUS_LOCATION = "";


    login = new Login({
      document,
      localStorage: window.localStorage,
      onNavigate,
      PREVIOUS_LOCATION,
      store,
    });

  })
  // crée un utilisateur et se connecte
  test('creates a user and logs in', async () => {
    const user = {
      type: "Employee",
      email: "test@example.com",
      password: "password",
      status: "connected"
    }
    store.create.mockResolvedValue()
    store.login = jest.fn().mockResolvedValue({ jwt: 'test-jwt' })
    await login.createUser(user)
    expect(store.create).toHaveBeenCalledWith({
      data: JSON.stringify({
        type: user.type,
        name: user.email.split('@')[0],
        email: user.email,
        password: user.password,
      })
    })
    expect(store.login).toHaveBeenCalledWith(JSON.stringify({
      email: user.email,
      password: user.password,
    }))
    expect(login.localStorage.setItem).toHaveBeenCalledWith('jwt', 'test-jwt')
  })
  //****************************************************//
  //gère une erreur lors de la création d'un utilisateur
  test('handles an error creating a user', async () => {
    const user = {
      type: "Employee",
      email: "test@example.com",
      password: "password",
      status: "connected"
    }
    const error = new Error('Test error')

    store.create.mockRejectedValue(error)
    await login.createUser(user)
    expect(store.create).toHaveBeenCalledWith({
      data: JSON.stringify({
        type: user.type,
        name: user.email.split('@')[0],
        email: user.email,
        password: user.password,
      })
    })
    expect(store.login).not.toHaveBeenCalled()
    expect(login.localStorage.setItem).not.toHaveBeenCalled()
  })
})
