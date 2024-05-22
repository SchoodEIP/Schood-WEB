import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmAccountsPage from '../../../Users/SchoolAdmin/schoolAdmAccountsPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('SchoolAdmAccountsPage', () => {
  let container = null
  const url = process.env.REACT_APP_BACKEND_URL
  const titleUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/titles`

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
      },
      picture: 'zerar'
    },
    {
      firstname: 'lasura',
      lastname: 'citrons',
      email: 'lasura@schood.fr',
      role: {
        _id: 1,
        name: 'teacher',
        levelOfAccess: 1
      },
      classes: {
        _id: 0,
        name: '200'
      },
      picture: null
    },
    {
      firstname: 'thomas',
      lastname: 'apple',
      email: 'thomas@schood.fr',
      role: {
        _id: 0,
        name: 'student',
        levelOfAccess: 0
      },
      classes: {
        _id: 0,
        name: '200'
      },
      picture: 'nufjds'
    },
    {
      firstname: 'thsdomas',
      lastname: 'appsdle',
      email: 'thomasds@schood.fr',
      role: {
        _id: 0,
        name: 'student',
        levelOfAccess: 0
      },
      classes: {
        _id: 0,
        name: '200'
      },
      picture: 'null'
    }
  ]

  const roles = [
    {
      _id: '4',
      name: 'job',
      levelOfAccess: '4'
    },
    {
      _id: '0',
      name: 'student',
      levelOfAccess: '0'
    },
    {
      _id: '1',
      name: 'teacher',
      levelOfAccess: '1'
    },
    {
      _id: '2',
      name: 'administration',
      levelOfAccess: '2'
    },
    {
      _id: '3',
      name: 'admin',
      levelOfAccess: '3'
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

  const titles = [
    {
      _id: '0',
      name: 'Math'
    },
    {
      _id: '1',
      name: 'Francais'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(url + '/shared/roles', { roles })
    fetchMock.get(url + '/user/all', users)
    fetchMock.get(url + '/shared/classes', classes)
    fetchMock.get(titleUrl, titles)
    fetchMock.post(url + '/adm/csvRegisterUser', {})
    fetchMock.post(url + '/adm/register', {})
    sessionStorage.setItem('role', 'administration')
    delete window.location
    window.location = { reload: jest.fn() }
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
    sessionStorage.removeItem('role')
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getAllByText('Prénom')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Nom')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Email')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Classe')[0]).toBeInTheDocument()
    expect(screen.getByText('Ajouter un Compte')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une Liste de Comptes')).toBeInTheDocument()
  })

  test('error message', async () => {
    fetchMock.post(url + '/adm/csvRegisterUser', { status: 300, body: [{ rowCSV: 2, errors: ['cet utilisateur existe déjà'] }] })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une Liste de Comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText('Créer le(s) Compte(s)')).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role'], 'example.csv', { type: 'text/csv' })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer le(s) Compte(s)')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
    expect(screen.getByText('À la ligne 2 du fichier CSV, cet utilisateur existe déjà')).toBeInTheDocument()
  })
  test('allows errors', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

    jest.spyOn(global, 'fetch').mockRejectedValueOnce({ message: 'error' })

    const manyAccountButton = screen.getByText('Ajouter une Liste de Comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role,class'], 'example.csv', { type: 'text/csv' })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer le(s) Compte(s)')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  test('allows creation of new student account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

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

    const newAccountBtn = screen.getByText('Créer le Compte')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })

    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
  })

  test('allows creation of new teacher account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

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
      fireEvent.change(roleInput, { target: { value: '1' } })
      fireEvent.change(classInput, { target: { value: '0' } })
    })

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')
    expect(roleInput).toHaveValue('1')
    await waitFor(() => { expect(classInput).toHaveValue('0') })

    await act(async () => {
      fireEvent.change(roleInput, { target: { value: '1' } })
    })

    await waitFor(() => { expect(roleInput).toHaveValue('1') })

    const selectedOption = [{ _id: '1' }]
    await act(async () => {
      fireEvent.change(classInput, { target: { value: selectedOption } })
    })

    const newAccountBtn = screen.getByText('Créer le Compte')
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
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une Liste de Comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstname,lastname,email,role,class'], 'example.csv', { type: 'text/csv' })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer le(s) Compte(s)')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('tests the popups', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une Liste de Comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.queryByText('Créer le Compte')).not.toBeInTheDocument()

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.queryByText('Créer le(s) Compte(s)')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.queryByText('Créer le Compte')).not.toBeInTheDocument()
  })
})
