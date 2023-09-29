import Messages from '../../../Components/ChatRoom/chatRoom'
import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import fetchMock from 'fetch-mock'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
)

describe('Messages Component', () => {
  const id = 123
  const chatUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat`
  const chatMessagesUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/messages`
  const contactUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/users`
  const newFile = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newFile`
  const newMessage = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newMessage`
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.post(chatUrl, { })
    fetchMock.post(chatMessagesUrl, { })
    fetchMock.post(contactUrl, { })
    fetchMock.post(newFile, { })
    fetchMock.post(newMessage, { })
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.restore()
  })

  it('renders the Messages component', async () => {

    await act(async () => {
      render(<Messages />)
    })

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

    await act(async () => {
      render(<Messages />)
    })

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

    await act(async () => {
      render(<Messages />)
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Nouvelle conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Nouvelle conversation');
      expect(popupTitle).toBeInTheDocument();
    });
  });


  it('sends a message- in chatroom', async () => {

    await act(async () => {
      render(<Messages />)
    })
    const input = screen.getByPlaceholderText('Composez votre message')

    // Type a message in the input field
    fireEvent.change(input, { target: { value: 'Hello, world!' } })

    // Click the "Envoyer" button to send the message
    fireEvent.click(screen.getByText('Envoyer'))
  })

});
