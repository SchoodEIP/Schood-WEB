import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsPage from '../../../Users/Admin/admAccountsPage'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('AdmAccountsPage', () => {
  let container = null
  const url = process.env.REACT_APP_BACKEND_URL

  const users = [
    {
      firstname: 'laura',
      lastname: 'citron',
      email: 'laura@schood.fr',
      role: {
        _id: 1,
        name: 'teacher',
        levelOfAccess: 1
      },
      classes: {
        _id: 0,
        name: '200'
      }
    },
    {
      firstname: 'thomas',
      lastname: 'apple',
      email: 'thomas@schood.fr',
      role: {
        _id: 1,
        name: 'student',
        levelOfAccess: 1
      },
      classes: {
        _id: 0,
        name: '200'
      }
    }
  ]

  const roles = [
    {
      _id: 0,
      name: 'student',
      levelOfAccess: 0
    },
    {
      _id: 1,
      name: 'teacher',
      levelOfAccess: 1
    },
    {
      _id: 2,
      name: 'administration',
      levelOfAccess: 2
    },
    {
      _id: 3,
      name: 'admin',
      levelOfAccess: 3
    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(url + '/adm/rolesList', { roles })
    fetchMock.get(url + '/user/all', users)
    fetchMock.post(url + '/adm/csvRegisterUser', {})
    fetchMock.post(url + '/adm/register', {})
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AdmAccountsPage />
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByTestId('single-account-btn')).toBeInTheDocument()
    expect(screen.getByTestId('many-account-btn')).toBeInTheDocument()
  })

  test('allows creation of new account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AdmAccountsPage />
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText("Création d'un compte Administrateur Scolaire")).toBeInTheDocument()

    const firstNameInput = screen.getByPlaceholderText('Prénom')
    const lastNameInput = screen.getByPlaceholderText('Nom')
    const emailInput = screen.getByPlaceholderText('Email')

    expect(firstNameInput).toHaveValue('')
    expect(lastNameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
    })
    await act(async () => {
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    })
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    })

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')

    const newAccountBtn = screen.getByText('Créer un nouveau compte')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })

    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
  })

  test('allows creation of new accounts with a file', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AdmAccountsPage />
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Administrateur Scolaire")).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role'], 'example.csv', { type: 'text/csv' })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer de nouveaux comptes')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
  })

  it('tests the popups', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AdmAccountsPage />
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Administrateur Scolaire")).toBeInTheDocument()
    expect(screen.queryByText("Création d'un compte Administrateur Scolaire")).not.toBeInTheDocument()

    const singleAccountButton = screen.getByText('Ajouter un compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText("Création d'un compte Administrateur Scolaire")).toBeInTheDocument()
    expect(screen.queryByText("Création d'une liste de comptes Administrateur Scolaire")).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Administrateur Scolaire")).toBeInTheDocument()
    expect(screen.queryByText("Création d'un compte Administrateur Scolaire")).not.toBeInTheDocument()
  })
})
