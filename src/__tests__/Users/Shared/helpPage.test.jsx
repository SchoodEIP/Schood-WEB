import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HelpPage from "../../../Users/Shared/helpPage.jsx"
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('helpPage', () => {
  const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
  const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'
  const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'
  const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'

  const categories = [
    {
      _id: 0,
      name: 'Default'
    },
    {
      _id: '1',
      name: 'Aide contre le harcèlement'
    }
  ]

  const helpNumbers = [
    {
      _id: '1',
      name: "Ligne d'urgence pour les victimes de violence familiale",
      telephone: '0289674512',
      email: 'example@schood.fr',
      description: 'lala',
      helpNumbersCategory: '1'
    },
    {
      _id: '2',
      name: "default number",
      telephone: '0289634512',
      email: 'exampele@schood.fr',
      description: 'laleea',
      helpNumbersCategory: '0'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(categoryUrl, categories)
    fetchMock.get(helpNumbersUrl, helpNumbers)
    fetchMock.post(helpNumberRegisterUrl, { status: 200 })
    fetchMock.post(categoryRegisterUrl, { status: 200 })
    sessionStorage.setItem('role', 'administration')
  })

  afterEach(() => {
    sessionStorage.removeItem('role')
    fetchMock.restore()
  })

  it('displays categories and contacts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Mes Aides')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une Catégorie')).toBeInTheDocument()
    expect(screen.getByText('Ajouter un Numéro')).toBeInTheDocument()
  })

  it('moves through the helps', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const categoryButton = screen.getAllByTestId('category-btn-undefined')

    await waitFor(async () => {
      expect(screen.queryByText("Ligne d'urgence pour les victimes de violence familiale")).toBeNull();
      expect(screen.getByText('Aide contre le harcèlement')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(categoryButton[1])
    })

    await waitFor(async () => {
      expect(screen.getByText("Ligne d'urgence pour les victimes de violence familiale")).toBeInTheDocument()
      expect(screen.queryByText('Aide contre le harcèlement')).toBeNull()
    })

    const numberButton = screen.getByText("Ligne d'urgence pour les victimes de violence familiale")

    await act(async () => {
      fireEvent.click(numberButton)
    })

    await waitFor(async () => {
      expect(screen.getByText("Ligne d'urgence pour les victimes de violence familiale")).toBeInTheDocument()
      expect(screen.getByText('0289674512')).toBeInTheDocument()
    })

    const returnButton = screen.getByText("Retour")

    await act(async () => {
      fireEvent.click(returnButton)
    })

    await waitFor(async () => {
      expect(screen.queryByText('0289674512')).toBeNull()
    })

    const returnButton2 = screen.getByText("Retour")

    await act(async () => {
      fireEvent.click(returnButton2)
    })

    await waitFor(async () => {
      expect(screen.queryByText("Ligne d'urgence pour les victimes de violence familiale")).toBeNull()
    })

    const defaultButton = screen.getByText("Default")

    await act(async () => {
      fireEvent.click(defaultButton)
    })


  })

  it('allows the creation of a new category', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const singleAccountButton = screen.getByText('Ajouter une Catégorie')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    const nameInput = screen.getByPlaceholderText('Nom')
    expect(nameInput).toHaveValue('')
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Violence' } })
    })
    expect(nameInput).toHaveValue('Violence')
    const newCategoryBtn = screen.getByText('Créer la Catégorie')
    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
  })

  it('allows the creation of a new contact', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const singleAccountButton = screen.getByText('Ajouter un Numéro')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

    const nameInput = screen.getByPlaceholderText('Nom')
    const telephoneInput = screen.getByPlaceholderText('0000000000')
    const emailInput = screen.getByPlaceholderText('prenom.nom.Schood1@schood.fr')
    const descriptionInput = screen.getByPlaceholderText("Une description à propos de l'aide fournie")

    expect(nameInput).toHaveValue('')
    expect(telephoneInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(descriptionInput).toHaveValue('')

    const newCategoryBtn = screen.getByText('Créer le Numéro')

    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
    expect(screen.getByText('Le nom est vide.')).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test' } })
    })

    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
    expect(screen.getByText('Veuillez fournir un numéro de téléphone valide (10 chiffres).')).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(telephoneInput, { target: { value: '0298123712' } })
    })

    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
    expect(screen.getByText('Veuillez fournir une adresse email valide.')).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@schood.fr' } })
    })

    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
    expect(screen.getByText("Veuillez fournir une description de ce numéro d'aide.")).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(descriptionInput, { target: { value: 'This is just a test' } })
    })

    expect(nameInput).toHaveValue('Test')
    expect(telephoneInput).toHaveValue('0298123712')
    expect(emailInput).toHaveValue('test@schood.fr')
    expect(descriptionInput).toHaveValue('This is just a test')

    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })
  })

  it('tests the popups', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const categoryButton = screen.getByText('Ajouter une Catégorie')

    await act(async () => {
      fireEvent.click(categoryButton)
    })
    expect(screen.getByText('Créer la Catégorie')).toBeInTheDocument()
    expect(screen.queryByText('Créer le Numéro')).not.toBeInTheDocument()

    const contactButton = screen.getByText('Ajouter un Numéro')

    await act(async () => {
      fireEvent.click(contactButton)
    })
    expect(screen.getByText('Créer le Numéro')).toBeInTheDocument()
    expect(screen.queryByText('Créer la Catégorie')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(categoryButton)
    })
    expect(screen.getByText('Créer la Catégorie')).toBeInTheDocument()
    expect(screen.queryByText('Créer le Numéro')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByText('Créer la Catégorie'))
    })

    await waitFor(async() => {
      expect(screen.getByText('La catégorie est vide.')).toBeInTheDocument()
    })
  })

  it('handles a 401 status code by calling disconnect for categoryUrl', async () => {
    fetchMock.get(categoryUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  });

  it('handles a 401 status code by calling disconnect for categoryUrl', async () => {
    fetchMock.get(helpNumbersUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter >
          <WebsocketProvider>
            <HelpPage />
          </WebsocketProvider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  });
})
