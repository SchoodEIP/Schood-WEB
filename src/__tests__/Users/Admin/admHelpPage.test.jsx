import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import HelpPage from "../../../Users/Shared/helpPage.jsx"
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('helpPage', () => {
  const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
  const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'
  const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'
  const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'

  const categories = [
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
      helpNumbersCategory: '2'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
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

    expect(screen.getByText('Catégories')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une Catégorie')).toBeInTheDocument()
    expect(screen.getByText('Ajouter un Contact')).toBeInTheDocument()
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
    expect(screen.getByText('Ajouter une nouvelle Catégorie')).toBeInTheDocument()
    const nameInput = screen.getByPlaceholderText('Nom')
    expect(nameInput).toHaveValue('')
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Violence' } })
    })
    expect(nameInput).toHaveValue('Violence')
    const newCategoryBtn = screen.getByText('Créer la catégorie')
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
    const singleAccountButton = screen.getByText('Ajouter un Contact')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText('Ajouter un nouveau Contact')).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Nom')
    const telephoneInput = screen.getByPlaceholderText('0000000000')
    const emailInput = screen.getByPlaceholderText('example@schood.fr')
    const descriptionInput = screen.getByPlaceholderText("Une description à propos de l'aide fournie")

    expect(nameInput).toHaveValue('')
    expect(telephoneInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(descriptionInput).toHaveValue('')

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test' } })
    })
    await act(async () => {
      fireEvent.change(telephoneInput, { target: { value: '0298123712' } })
    })
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@schood.fr' } })
    })
    await act(async () => {
      fireEvent.change(descriptionInput, { target: { value: 'This is just a test' } })
    })

    expect(nameInput).toHaveValue('Test')
    expect(telephoneInput).toHaveValue('0298123712')
    expect(emailInput).toHaveValue('test@schood.fr')
    expect(descriptionInput).toHaveValue('This is just a test')

    const newCategoryBtn = screen.getByText('Créer le contact')

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
    expect(screen.getByText('Ajouter une nouvelle Catégorie')).toBeInTheDocument()
    expect(screen.queryByText('Ajouter un nouveau Contact')).not.toBeInTheDocument()

    const contactButton = screen.getByText('Ajouter un Contact')

    await act(async () => {
      fireEvent.click(contactButton)
    })
    expect(screen.getByText('Ajouter un nouveau Contact')).toBeInTheDocument()
    expect(screen.queryByText('Ajouter une nouvelle Catégorie')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(categoryButton)
    })
    expect(screen.getByText('Ajouter une nouvelle Catégorie')).toBeInTheDocument()
    expect(screen.queryByText('Ajouter un nouveau Contact')).not.toBeInTheDocument()
  })
})
