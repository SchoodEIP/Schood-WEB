import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsPage from '../../../Users/Admin/admAccountsPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('AdmAccountsPage', () => {
  let container = null
  const url = process.env.REACT_APP_BACKEND_URL
  sessionStorage.setItem('role', 'admin')

  const users = [
    {
      firstname: 'laura',
      lastname: 'citron',
      email: 'laura@schood.fr',
      role: {
        _id: 2,
        name: 'administration',
        levelOfAccess: 2
      }
    },
    {
      active: true,
      classes: [],
      createdAt: '2024-05-06T09:46:56.511Z',
      email: 'jacqueline.delais.Schood1@schood.fr',
      facility: '6638a70fdd18a1e42e53944d',
      firstConnexion: true,
      firstname: 'Jacqueline',
      lastname: 'Delais',
      picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvw',
      role: { _id: '6638a70fdd18a1e42e539448', name: 'administration', levelOfAccess: 2, __v: 0 },
      updatedAt: '2024-05-06T09:46:56.511Z',
      __v: 0,
      _id: '6638a710dd18a1e42e53947e'
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
    fetchMock.get(url + '/shared/roles', { roles })
    fetchMock.get(url + '/user/all', { status: 200, body: users })
    fetchMock.post(url + '/adm/csvRegisterUser', {})
    fetchMock.post(url + '/adm/register', {})
    fetchMock.get(url + '/shared/classes', classes)
    fetchMock.get(url + '/shared/titles', titles)
    sessionStorage.setItem('role', 'admin')
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
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Ajouter un Compte')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une Liste de Comptes')).toBeInTheDocument()
  })

  test('allows creation of new account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText('Créer le Compte')).toBeInTheDocument()

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

    const newAccountBtn = screen.getByText('Créer le Compte')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })

    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
    expect(window.location.reload).toHaveBeenCalled()
  })

  test('allows creation of new accounts with a file', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
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
    expect(window.location.reload).toHaveBeenCalled()
  })

  test('error message', async () => {
    fetchMock.post(url + '/adm/csvRegisterUser', { status: 300, body: [{ rowCSV: 2, errors: ['cet utilisateur existe déjà'] }] })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
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

  it('tests the popups', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une Liste de Comptes')

    await act(async () => {
      fireEvent.click(manyAccountButton)
    })
    await waitFor(async () => {
      expect(screen.queryByText('Créer le(s) Compte(s)')).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-many'))
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

    await waitFor(async () => {
      expect(screen.queryByText('Créer le(s) Compte(s)')).not.toBeInTheDocument()
    })
  })

  test('checks disconnect through roles url', async () => {
    fetchMock.get(url + '/shared/roles', 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks disconnect through user url', async () => {
    fetchMock.get(url + '/user/all', 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks disconnect through register url', async () => {
    fetchMock.post(url + '/adm/register', 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const singleAccountButton = screen.getByText('Ajouter un Compte')

    await act(async () => {
      fireEvent.click(singleAccountButton)
    })
    expect(screen.getByText('Créer le Compte')).toBeInTheDocument()

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

    const newAccountBtn = screen.getByText('Créer le Compte')
    await act(async () => {
      fireEvent.click(newAccountBtn)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks disconnect through post csvRegister url', async () => {
    fetchMock.post(url + '/adm/csvRegisterUser', 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsPage />
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

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })
})
