import Messages from '../../../Components/ChatRoom/chatRoom'
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
)

describe('Messages Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the Messages component', async () => {
    render(<Messages />)

    // Ensure that the component renders
    const composeMessageInput = screen.getByPlaceholderText('Composez votre message')
    expect(composeMessageInput).toBeInTheDocument()

    // Simulate sending a message
    fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    fireEvent.click(screen.getByText('Envoyer'))

    // Wait for message to be sent
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  it('displays an error message when message sending fails', async () => {
    // Mock a failed fetch request
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to send message'))
    )

    render(<Messages />)

    const composeMessageInput = screen.getByPlaceholderText('Composez votre message')
    fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    fireEvent.click(screen.getByText('Envoyer'))

    // Wait for error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
      expect(errorMessage).toBeInTheDocument()
    })
  })

  // Add more test cases to cover other parts of the component

  // Example test for opening create conversation popup
  it('opens the create conversation popup when the button is clicked', async () => {
    render(<Messages />)

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Nouvelle conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Nouvelle conversation')
      expect(popupTitle).toBeInTheDocument()
    })
  })
})
