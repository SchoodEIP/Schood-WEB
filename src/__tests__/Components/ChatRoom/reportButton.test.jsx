import React from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom/'
import ReportButton from '../../../Components/ChatRoom/reportButton'

describe('ReportButton Component', () => {
  it('renders the report button initially', () => {
    render(<ReportButton />)
    const reportButton = screen.getByText('Signaler')
    expect(reportButton).toBeInTheDocument()
  })

  it('displays the confirmation UI when the report button is clicked', () => {
    render(<ReportButton />)
    const reportButton = screen.getByText('Signaler')
    fireEvent.click(reportButton)
    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    const confirmButton = screen.getByText('Confirmer le signalement')
    expect(reasonSelect).toBeInTheDocument()
    expect(confirmButton).toBeInTheDocument()
  })

  it('handles successful reporting', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }))

    render(<ReportButton currentConversation={{ _id: 'conversationId' }} />)
    const reportButton = screen.getByText('Signaler')
    fireEvent.click(reportButton)

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    fireEvent.change(reasonSelect, { target: { value: 'Spam' } })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_URL}/user/chat/report`,
      expect.objectContaining({
          method: 'POST',
          body: expect.stringMatching(/conversationId/i) && expect.stringMatching(/Spam/i)
      })    
    )
  })

  it('handles server error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 500 }))

    render(<ReportButton currentConversation={{ _id: 'conversationId' }} />)
    const reportButton = screen.getByText('Signaler')
    fireEvent.click(reportButton)

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    fireEvent.change(reasonSelect, { target: { value: 'Spam' } })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    const errorMessage = screen.getByText('Erreur lors du signalement de la conversation.')
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles network error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

    render(<ReportButton currentConversation={{ _id: 'conversationId' }} />)
    const reportButton = screen.getByText('Signaler')
    fireEvent.click(reportButton)

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    fireEvent.change(reasonSelect, { target: { value: 'Spam' } })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    const errorMessage = screen.getByText('Erreur lors du signalement de la conversation.')
    expect(errorMessage).toBeInTheDocument()
  })

  it('handles reason selection and confirmation', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }))

    render(<ReportButton currentConversation={{ _id: 'conversationId' }} />)

    const reportButton = screen.getByText('Signaler')
    fireEvent.click(reportButton)

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    fireEvent.change(reasonSelect, { target: { value: 'Spam' } })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_URL}/user/chat/report`,
      expect.objectContaining({
          method: 'POST',
          body: expect.stringMatching(/conversationId/i) && expect.stringMatching(/Spam/i)
      })
    )
  })
})
