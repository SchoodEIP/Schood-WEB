import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../Users/Public/loginPage'

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    token: 'falseToken',
    role: 'admin',
  })
}));

describe('Login', () => {

  it('renders email and password inputs', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('********')
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('updates email state when input value changes', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('updates password state when input value changes', () => {
    render(<Login />)
    const passwordInput = screen.getByPlaceholderText('********')
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    expect(passwordInput.value).toBe('testpassword')
  })

  it('check email when login button is clicked', () => {
    render(<Login />)
    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)
    expect(screen.getByText('Email is not valid')).toBeInTheDocument()
  })

  it('displays error message when email is invalid', () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('Email')
    const loginButton = screen.getByText('Login')
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.click(loginButton)
    const errorMessage = screen.getByText('Email is not valid')
    expect(errorMessage).toBeInTheDocument()
  })

  // it('valid credentials', async () => {
  //   render(<Login />)
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passInput = screen.getByPlaceholderText('********')
  //   const loginButton = screen.getByText('Login')
  //   fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })
  //   fireEvent.change(passInput, { target: { value: 'admin123' } })
  //   await act(async () => fireEvent.click(loginButton))
  //   expect(window.localStorage.getItem('token')).toBe('falseToken')
  //   expect(window.localStorage.getItem('role')).toBe('admin')
  //   expect(window.sessionStorage.getItem('token')).toBe('falseToken')
  //   expect(window.sessionStorage.getItem('role')).toBe('admin')
  // })
})
