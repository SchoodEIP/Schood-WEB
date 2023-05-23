import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ForgottenPasswordPage from '../Users/Public/ForgottenPasswordPage'

describe('ForgottenPasswordPage', () => {
  it('updates email state when input value changes', () => {
    render(<ForgottenPasswordPage />)
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('check email when request button is clicked', () => {
    render(<ForgottenPasswordPage />)
    const requestButton = screen.getByText('Demander un nouveau mot de passe')
    console.log(requestButton)
    fireEvent.click(requestButton)
    expect(screen.getByText('Email is not valid')).toBeInTheDocument()
  })

  it('displays error message when email is invalid', () => {
    render(<ForgottenPasswordPage />)
    const emailInput = screen.getByPlaceholderText('Email')
    const requestButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.change(emailInput, { target: { value: 'ablabla' } })
    fireEvent.click(requestButton)
    const errorMessage = screen.getByText('Email is not valid')
    expect(errorMessage).toBeInTheDocument()
  })
})
