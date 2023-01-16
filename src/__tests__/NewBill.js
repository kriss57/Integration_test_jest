/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router.js";
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import { bills } from "../fixtures/bills";
import mockStore from "../__mocks__/store.js";


//Étant donné que je suis connecté en tant qu'employé
describe("Given I am connected as an employee", () => {
  //Quand je suis sur la page NewBill
  describe("When I am on NewBill Page", () => {
    //Ensuite, l'icône de la facture dans la disposition verticale doit être mise en surbrillance
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      // ajouté .toBe(true) ne fonctionne pas
      expect(windowIcon).toHaveClass('active-icon')
    })
  })

  //Quand je suis sur la page NewBill
  describe("When I am on NewBill Page", () => {
    //Ensuite, les entrées sont vides et je clique pour soumettre
    test("Then, the inputs are empty and i click for submit", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const input1 = screen.getByTestId("expense-type")
      expect(input1.value).toBe('Transports')
      const input2 = screen.getByTestId("expense-name")
      expect(input2.value).toBe('')
      const input3 = screen.getByTestId("datepicker")
      expect(input3.value).toBe("")
      const input4 = screen.getByTestId("amount")
      expect(input4.value).toBe('')
      const tva1 = screen.getByTestId("vat")
      expect(tva1.value).toBe('')
      const tva2 = screen.getByTestId("pct")
      expect(tva2.value).toBe('')
      const commentaire = screen.getByTestId("commentary")
      expect(commentaire.value).toBe('')
      const inputFile = screen.getByTestId("file")
      expect(inputFile.value).toBe('')

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    })
  })

  describe('When, handleChangeFile ', () => {
    //Ensuite, le format de fichier est jpeg/jpg/png
    test('Then, the file format is jpeg / jpg / png', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      // init onNavigate
      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };
      // Init new NewBill
      const newBill = new NewBill({ document, onNavigate, store: null, bills, localStorage: window.localStorage, });
      // simule le click du btn handleChangeFile(e)
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      // bouton dans DOM
      const inputFile = screen.getByTestId("file");
      expect(inputFile).toBeTruthy()
      // Ajouter un événement et déclenche le click
      inputFile.addEventListener("change", handleChangeFile);
      // Simule jpeg format
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["file.jpeg"], "file.jpeg", { type: "file/jpeg" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("file.jpeg");

      jest.spyOn(window, "alert").mockImplementation(() => { });
      expect(window.alert).not.toHaveBeenCalled();
    })
  })
})


describe('fileReader', () => {
  //renvoie true pour un fichier avec une extension jpeg
  it('returns true for a file with a jpeg extension', () => {
    const html = NewBillUI();
    document.body.innerHTML = html;
    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = pathname;
    };
    // Init new NewBill
    const newBill = new NewBill({ document, onNavigate, store: null, bills, localStorage: window.localStorage, });

    const result = newBill.fileReader('file.jpeg');
    expect(result).toBe(true);
  });
  //renvoie true pour un fichier avec une extension jpg
  it('returns true for a file with a jpg extension', () => {
    const html = NewBillUI();
    document.body.innerHTML = html;
    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = pathname;
    };
    // Init new NewBill
    const newBill = new NewBill({ document, onNavigate, store: null, bills, localStorage: window.localStorage, });

    const result = newBill.fileReader('file.jpg');
    expect(result).toBe(true);
  });
  //renvoie true pour un fichier avec une extension png
  it('returns true for a file with a png extension', () => {
    const html = NewBillUI();
    document.body.innerHTML = html;
    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = pathname;
    };
    // Init new NewBill
    const newBill = new NewBill({ document, onNavigate, store: null, bills, localStorage: window.localStorage, });

    const result = newBill.fileReader('file.png');
    expect(result).toBe(true);
  });
  //renvoie faux pour un fichier avec une extension invalide
  it('returns false for a file with an invalid extension', () => {
    const html = NewBillUI();
    document.body.innerHTML = html;
    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = pathname;
    };
    // Init new NewBill
    const newBill = new NewBill({ document, onNavigate, store: null, bills, localStorage: window.localStorage, });

    const result = newBill.fileReader('file.invalid');
    expect(result).toBe(false);
  });
});

// ---------------------------------------- //
// ----- Test d'intégration POST ------- //

//Etant donné que je suis un utilisateur connecté en tant qu'employé
describe('Given I am a user connected as Employee', () => {
  //Lorsque j'envoi le formulaire rempli
  describe("When I send the form completed", () => {
    //Ensuite, la facture est créée
    test("Then the bill is created", async () => {

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "azerty@email.com",
      }))

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const bill = {
        "name": "Transports",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "vat": "80",
        "pct": 20,
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "accepted"
      };

      screen.getByTestId("expense-type").value = bill.type;
      screen.getByTestId("expense-name").value = bill.name;
      screen.getByTestId("datepicker").value = bill.date;
      screen.getByTestId("amount").value = bill.amount;
      screen.getByTestId("vat").value = bill.vat;
      screen.getByTestId("pct").value = bill.pct;
      screen.getByTestId("commentary").value = bill.commentary;

      newBill.fileName = bill.fileName
      newBill.fileUrl = bill.fileUrl;
      newBill.updateBill = jest.fn();

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      const form = screen.getByTestId("form-new-bill");

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(newBill.updateBill).toHaveBeenCalled()

    })
    //API erreur 500
    test('fetches error from an API and fails with 500 error', async () => {
      jest.spyOn(mockStore, 'bills')
      jest.spyOn(console, 'error').mockImplementation(() => { })

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })

      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      router()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error('Erreur 500'))
          }
        }
      })
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })

      // Submit formulaire
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      await new Promise(process.nextTick)
      expect(console.error).toBeCalled()
    })
  })
})

//------------------------------------------------------------//

describe('handleChangeFile', () => {
  //définit fileUrl et fileName avec l'URL et le nom du fichier sélectionné
  test('sets fileUrl and fileName with the URL and name of the selected file', () => {
    const html = NewBillUI()
    document.body.innerHTML = html

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: "azerty@email.com",
    }))


    const mockStore = {
      bills: jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue({ fileUrl: 'url', key: 'key' })
      })
    };
    const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });

    const file = {
      files: [{}]
    };
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'path\\to\\file.jpg'
      }
    };

    newBill.handleChangeFile(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockStore.bills).toHaveBeenCalled();
    expect(mockStore.bills().create).toHaveBeenCalledWith({
      data: expect.any(FormData),
      headers: {
        noContentType: true
      }
    });

  })
})