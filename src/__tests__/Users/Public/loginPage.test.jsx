import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../../../Users/Public/loginPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Connexion', () => {
  const roleResponse = {
    status: 200,
    _id: '1',
    role: {
      _id: '1',
      name: 'rolly-polly'
    }
  }
  const authUrl = `${process.env.REACT_APP_BACKEND_URL}/user/profile`
  const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/user/login`

  it('renders email and password inputs', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const emailInput = screen.getByPlaceholderText('email')
    const passwordInput = screen.getByPlaceholderText('mot de passe')
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('updates email state when input value changes', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const emailInput = screen.getByPlaceholderText('email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('updates password state when input value changes', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const passwordInput = screen.getByPlaceholderText('mot de passe')
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    expect(passwordInput.value).toBe('testpassword')
  })

  it('check email when login button is clicked', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const loginButton = screen.getByText('Connexion')
    fireEvent.click(loginButton)
    expect(screen.getByText("L'adresse email n'est pas valide.")).toBeInTheDocument()
  })

  it('displays error message when email is invalid', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const emailInput = screen.getByPlaceholderText('email')
    const loginButton = screen.getByText('Connexion')
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.click(loginButton)
    const errorMessage = screen.getByText("L'adresse email n'est pas valide.")
    expect(errorMessage).toBeInTheDocument()
  })

  it('validates password and displays error message for empty password', async () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const submitButton = screen.getByText('Connexion')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Le mot de passe est vide.')).toBeInTheDocument()
    })
  })

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(authUrl, roleResponse)
    fetchMock.post(loginUrl, { status: 200, token: 'mock-token' })
    fetchMock.config.overwriteRoutes = true
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('sends login request and sets token on successful login', async () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <Login />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const passwordInput = screen.getByPlaceholderText('mot de passe')
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })

    const submitButton = screen.getByText('Connexion')
    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(sessionStorage.getItem('token')).toBe('mock-token')
      expect(localStorage.getItem('token')).toBe('mock-token')
      expect(localStorage.getItem('role')).toBe('rolly-polly')
      expect(localStorage.getItem('id')).toBe('1')
    })
  })

  it('sends errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Login />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const emailInput = screen.getByPlaceholderText('email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const passwordInput = screen.getByPlaceholderText('mot de passe')
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })

    const submitButton = screen.getByText('Connexion')
    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(async () => {
      expect(screen.getByText('Error: Error: Network Error'))
    })
  })
})
