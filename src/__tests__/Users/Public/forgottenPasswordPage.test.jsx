import '@testing-library/jest-dom'
import ForgottenPasswordPage from '../../../Users/Public/forgottenPasswordPage'
import React from 'react'
import { render, act, fireEvent, waitFor, screen } from '@testing-library/react'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('ForgottenPasswordPage', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({})
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('updates email state when input value changes', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const emailInput = screen.getByPlaceholderText('Adresse Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('check email when request button is clicked', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const requestButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.click(requestButton)
    expect(screen.getByText('Email is not valid')).toBeInTheDocument()
  })

  it('displays error message when email is invalid', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const emailInput = screen.getByPlaceholderText('Adresse Email')
    const requestButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.change(emailInput, { target: { value: 'ablabla' } })
    fireEvent.click(requestButton)
    const errorMessage = screen.getByText('Email is not valid')
    expect(errorMessage).toBeInTheDocument()
  })

  it('validates email and displays success message for valid email', async () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Adresse Email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const submitButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Si un compte existe avec cet email, un nouveau mot de passe vous a été envoyé.')).toBeInTheDocument()
    })
  })

  it('checks error handling Network Error', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Adresse Email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const submitButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.click(submitButton)

    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })

  it('checks error handling Error 400', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      status: 400,
      json: async () => ({ error: 'Bad Request' })
    })

    global.fetch = mockFetch

    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ForgottenPasswordPage />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Adresse Email')
    fireEvent.change(emailInput, { target: { value: 'admin@schood.fr' } })

    const submitButton = screen.getByText('Demander un nouveau mot de passe')
    fireEvent.click(submitButton)

    await act(async () => {
      const response = await mockFetch()
      const responseData = await response.json()
      expect(responseData.error).toEqual('Bad Request')
    })
  })
})
