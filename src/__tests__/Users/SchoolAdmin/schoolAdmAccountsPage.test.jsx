import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmAccountsPage from '../../../Users/SchoolAdmin/schoolAdmAccountsPage'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('SchoolAdmAccountsPage', () => {
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

  const classes = [
    {
      _id: 0,
      name: '200',
      facility: '0'
    },
    {
      _id: 1,
      name: '201',
      facility: '0'
    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(url + '/shared/roles', { roles })
    fetchMock.get(url + '/user/all', users)
    fetchMock.get(url + '/shared/classes', classes)
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
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByTestId('single-account-btn')).toBeInTheDocument()
    expect(screen.getByTestId('many-account-btn')).toBeInTheDocument()
  })

  test('allows errors', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText("Création d'un compte Etudiant/Professeur")).toBeInTheDocument()

    jest.spyOn(global, 'fetch').mockRejectedValueOnce({ message: 'error' })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Etudiant/Professeur")).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role,class'], 'example.csv', { type: 'text/csv' })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer de nouveaux comptes')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  test('allows creation of new account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText("Création d'un compte Etudiant/Professeur")).toBeInTheDocument()

    const firstNameInput = screen.getByPlaceholderText('Prénom')
    const lastNameInput = screen.getByPlaceholderText('Nom')
    const emailInput = screen.getByPlaceholderText('Email')
    const roleInput = screen.getByPlaceholderText('Rôle')
    const classInput = screen.getAllByRole('combobox')[1]

    expect(firstNameInput).toHaveValue('')
    expect(lastNameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(roleInput).toHaveValue(undefined)

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
      fireEvent.change(roleInput, { target: { value: '0' } })
      fireEvent.change(classInput, { target: { value: 0 } })
    })

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')
    expect(roleInput).toHaveValue('0')
    await waitFor(() => { expect(classInput).toHaveValue('0') })

    await act(async () => {
      fireEvent.change(roleInput, { target: { value: '1' } })
    })

    await waitFor(() => { expect(roleInput).toHaveValue('1') })

    await act(async () => {
      fireEvent.change(roleInput, { target: { value: '0' } })
    })

    await waitFor(() => { expect(roleInput).toHaveValue('0') })

    const selectedOption = [{ _id: '1' }]
    await act(async () => {
      fireEvent.change(classInput, { target: { value: selectedOption } })
    })

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
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Etudiant/Professeur")).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role,class'], 'example.csv', { type: 'text/csv' })
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
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Etudiant/Professeur")).toBeInTheDocument()
    expect(screen.queryByText("Création d'un compte Etudiant/Professeur")).not.toBeInTheDocument()

    const singleAccountButton = screen.getByText('Ajouter un compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText("Création d'un compte Etudiant/Professeur")).toBeInTheDocument()
    expect(screen.queryByText("Création d'une liste de comptes Etudiant/Professeur")).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Etudiant/Professeur")).toBeInTheDocument()
    expect(screen.queryByText("Création d'un compte Etudiant/Professeur")).not.toBeInTheDocument()
  })
})
