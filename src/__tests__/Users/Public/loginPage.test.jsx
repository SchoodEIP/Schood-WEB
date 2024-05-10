import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../../../Users/Public/loginPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('Connexion', () => {
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
    expect(screen.getByText('Email is not valid')).toBeInTheDocument()
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
    const errorMessage = screen.getByText('Email is not valid')
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
      expect(screen.getByText('Password is empty')).toBeInTheDocument()
    })
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

    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token: 'mock-token' })
    })

    const submitButton = screen.getByText('Connexion')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(sessionStorage.getItem('token')).toBe('mock-token')
      expect(localStorage.getItem('token')).toBe('mock-token')
    })

    expect(window.fetch).toHaveBeenCalledTimes(2)
    expect(window.fetch).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL + '/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@schood.fr',
        password: 'admin123'
      })
    })
  })
})
