import '@testing-library/jest-dom'
import ForgottenPasswordPage from '../Users/Public/ForgottenPasswordPage'
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';


beforeEach(() => {
  jest.spyOn(window, 'fetch').mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue({}),
  });
})

afterEach(() => {
  jest.restoreAllMocks();
})

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

  it('validates email and displays success message for valid email', async () => {
    render(<ForgottenPasswordPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } });

    const submitButton = screen.getByText('Demander un nouveau mot de passe');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Si un compte existe avec cet email, un nouveau mot de passe vous a été envoyé.')).toBeInTheDocument();
    });
  });
})