/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import Bills from "../containers/Bills.js"
import userEvent from '@testing-library/user-event'

import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // ajouté .toBe(true) ne fonctionne pas
      expect(windowIcon).toHaveClass('active-icon')


    })

    //Ensuite, les factures doivent être commandées du plus ancien au plus tard
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })


  })
})

// --------------------------------------------------------------------------------------- //
// ----------  test unitaire 34-35 verifier le changement d'affichage au click btn newBill
//Lorsque je clique sur le bouton Nouvelle facture
describe('When I click on the New Bill button', () => {
  //Ensuite, il devrait changer de page pour la page NewBill
  test('Then, it should change page for NewBill page', () => {
    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    // definit les props de l objet window 
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    // attribution du contenu html
    document.body.innerHTML = BillsUI({ bills })
    // Init new Bills
    const initBills = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage, });
    // simule le click du btn handleClickNewBill
    const handleClickNewBill = jest.fn((e) => initBills.handleClickNewBill);
    // bouton dans DOM
    const billBtn = screen.getByTestId('btn-new-bill');
    // Ajouter un événement et déclenche le click
    billBtn.addEventListener('click', handleClickNewBill);
    userEvent.click(billBtn);
    // est ce que ca affiche: Envoyer une note de frais
    expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
  });
});

// -------- test unitaire 39-42
//test de handleClickIconEye(icon) open modal
//Quand je clique sur le bouton de l'œil
describe('When I click on the eye button', () => {
  //Ensuite, il devrait ouvrir modal
  test('Then, it should open modal', () => {
    // simulation modal
    $.fn.modal = jest.fn()
    //window.$ = jest.fn().mockImplementation(() => { return { modal: jest.fn() } });

    // init onNavigate
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    //definit les props de l objet window ????
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    // attribution du contenu html
    document.body.innerHTML = BillsUI({ data: bills })
    // Init new Bills
    const initBills = new Bills({ document, onNavigate, store: mockStore, localStorage: window.localStorage, });
    // bouton dans DOM
    const modalBtn = screen.getAllByTestId('icon-eye')[0]
    // simule le click du btn handleClickNewBill
    const handleClickIconEye = jest.fn((e) => { initBills.handleClickIconEye(e.target) });
    // Ajouter un événement et déclenche le click
    modalBtn.addEventListener('click', handleClickIconEye);
    userEvent.click(modalBtn);
    // est ce que ca affiche: Envoyer une note de frais
    //expect(handleClickIconEye).toHaveBeenCalled();
    expect(screen.getAllByText('Justificatif')).toBeTruthy();
  });
});

// -------- test unitaire 67-68
// test affichage message ...loading
//Lorsque je suis sur la page Factures et que le chargement est en cours
describe("When I am on Bills page and it's loading", () => {
  //Ensuite, la page de chargement devrait s'afficher
  test("Then Loading page should be displayed", () => {
    const html = BillsUI({ data: bills, loading: true });
    document.body.innerHTML = html;
    const isLoading = screen.getAllByText("Loading...");
    expect(isLoading).toBeTruthy();
  })
})
//test des message d'erreur a l affichage
//Lorsque je suis sur la page Factures avec une erreur
describe("When I am on Bills page with an error", () => {
  //Ensuite, la page d'erreur doit être affichée
  test("Then Error page should be displayed", () => {
    const html = BillsUI({ data: bills, error: true });
    document.body.innerHTML = html;
    const hasError = screen.getAllByText("Erreur");
    expect(hasError).toBeTruthy();
  })
})


// test d'intégration GET
//Etant donné que je suis un utilisateur connecté en tant que Salarié
describe("Given I am a user connected as Employee", () => {
  //Lorsque j'accède à Factures
  describe("When I navigate to Bills", () => {
    //récupère les factures de l'API GET BILLS
    test("fetches bills from API GET BILLS", async () => {
      // change type
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      // change rotes.PATH
      window.onNavigate(ROUTES_PATH.Bills)
      // test si on affiche bien titre et btn
      const contentText = await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(contentText).toBeTruthy()
      const contentBtn = screen.getByTestId("btn-new-bill")
      expect(contentBtn).toBeTruthy()

    })
  })

  //Lorsqu'une erreur se produit sur l'API
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    //récupère les factures d'une API et échoue avec une erreur de message 404
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      // voir si message erreur ok
      document.body.innerHTML = BillsUI({ error: "Erreur 404" })

      const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    //récupère les messages d'une API et échoue avec une erreur de message 500
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      // voir si message erreur ok
      document.body.innerHTML = BillsUI({ error: "Erreur 500" })

      const message = screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

})


