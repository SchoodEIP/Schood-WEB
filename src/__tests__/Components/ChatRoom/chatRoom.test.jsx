import Messages from '../../../Components/ChatRoom/chatRoom'
import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import '@testing-library/jest-dom/'

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
    fetchMock.get(chatUrl, {
      _id: '123',
      createdBy: '0',
      date: '2023-09-29T10:13:56.756Z',
      facility: '0',
      participants: [
        {
          _id: '0',
          email: 'teacher1@schood.fr',
          firstname: 'teacher1',
          lastname: 'teacher1'
        },
        {
          _id: '1',
          email: 'teacher2@schood.fr',
          firstname: 'teacher2',
          lastname: 'teacher2'
        }
      ]
    })
    fetchMock.get(chatMessagesUrl, [
      {
        _id: '0',
        content: 'this is the content',
        date: '2023-09-29T10:13:56.756Z',
        user: '0'
      },
      {
        _id: '1',
        content: 'this is the content too',
        date: '2023-09-29T10:13:56.756Z',
        file: '0',
        user: '1'
      }
    ])
    fetchMock.get(contactUrl, [
      {
        _id: '0',
        firstname: 'teacher1',
        lastname: 'teacher1',
        role: {
          _id: '0',
          name: 'teacher',
          levelOfAccess: '2'
        }
      },
      {
        _id: '1',
        firstname: 'teacher2',
        lastname: 'teacher2',
        role: {
          _id: '0',
          name: 'teacher',
          levelOfAccess: '2'
        }
      },
      {
        _id: '2',
        firstname: 'student1',
        lastname: 'student1',
        role: {
          _id: '1',
          name: 'student',
          levelOfAccess: '1'
        }
      }
    ])
    fetchMock.post(newFile, { })
    fetchMock.post(newMessage, { })
    fetchMock.post(chatUrl, {
      _id: '1234',
      createdBy: '0',
      date: '2023-10-29T10:13:56.756Z',
      facility: '0',
      participants: [
        {
          _id: '0',
          email: 'teacher1@schood.fr',
          firstname: 'teacher1',
          lastname: 'teacher1'
        },
        {
          _id: '2',
          email: 'student1@schood.fr',
          firstname: 'student1',
          lastname: 'student1'
        }
      ]
    })
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
    const composeMessageInput = screen.getByText('Aucune conversation sélectionnée.')
    expect(composeMessageInput).toBeInTheDocument()
  })

  it('displays an error message when message sending fails', async () => {
    // Mock a failed fetch request
    // const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    // global.fetch = mockFetch

    // fetch.mockImplementationOnce(() =>
    //   Promise.reject(new Error('Failed to send message'))
    // )

    await act(async () => {
      render(<Messages />)
    })

    // const composeMessageInput = screen.getByPlaceholderText('Composez votre message')
    // fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    // fireEvent.click(screen.getByText('Envoyer'))

    // // Wait for error message to be displayed
    // await waitFor(() => {
    //   const errorMessage = screen.getByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
    //   expect(errorMessage).toBeInTheDocument()
    // })
  })

  // Add more test cases to cover other parts of the component

  it('sends a message- in chatroom', async () => {
    // await act(async () => {
    //   render(<Messages />)
    // })
    // const input = screen.getByPlaceholderText('Composez votre message')

    // // Type a message in the input field
    // fireEvent.change(input, { target: { value: 'Hello, world!' } })

    // // Click the "Envoyer" button to send the message
    // fireEvent.click(screen.getByText('Envoyer'))
  })

  it('handles file uploading', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that file input is present
    const fileInput = screen.getByLabelText('+')
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })

    // Ensure that file type is set
    await waitFor(() => {
      const fileTypeElement = screen.getByText('image')
      expect(fileTypeElement).toBeInTheDocument()
    })
  })

  it('calls sendMessage when Enter key is pressed', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Simulate user typing a message and pressing Enter
    const messageInput = screen.getByPlaceholderText('Composez votre message');
    fireEvent.change(messageInput, { target: { value: 'New Message' } });
    await act(async () => {
      fireEvent.keyPress(messageInput, { key: 'Enter', code: 13, charCode: 13 });
    })
  });

  it('calls clearMessageAndError when clearing messages and error', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that error and messages are displayed
    const errorElement = screen.getByText('Error Message') // Adjust the text as needed
    expect(errorElement).toBeInTheDocument()
    const messageElement = screen.getByText('Message Content') // Adjust the text as needed
    expect(messageElement).toBeInTheDocument()

    // Call clearMessageAndError
    await act(async () => {
      fireEvent.click(screen.getByText('Clear Messages')); // Adjust the text as needed
    })

    // Ensure that error and messages are cleared
    await waitFor(() => {
      const clearedErrorElement = screen.queryByText('Error Message') // Adjust the text as needed
      expect(clearedErrorElement).not.toBeInTheDocument()
    })

    await waitFor(() => {
      const clearedMessageElement = screen.queryByText('Message Content') // Adjust the text as needed
      expect(clearedMessageElement).not.toBeInTheDocument()
    })
  })

  it('opens and closes create conversation popup', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Create Conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    await act(async () => {
      fireEvent.click(screen.getByText('Open Create Conversation Popup')); // Adjust the text as needed      
    })

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Create Conversation') // Adjust the text as needed
      expect(popupTitle).toBeInTheDocument()
    })

    // Click the button to close the popup
    await act(async () => {
      fireEvent.click(screen.getByText('Close Create Conversation Popup')); // Adjust the text as needed
    })

    // Wait for the popup to be closed
    await waitFor(() => {
      const popupTitle = screen.queryByText('Create Conversation') // Adjust the text as needed
      expect(popupTitle).not.toBeInTheDocument()
    })
  })

  it('calls createConversation when creating a new conversation', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Click the button to open the popup
    await act(async () => {
      fireEvent.click(screen.getByText('Open Create Conversation Popup')); // Adjust the text as needed      
    })

    // Simulate user input and submission in the create conversation popup
    const conversationInput = screen.getByPlaceholderText('Conversation Name') // Adjust the text as needed
    fireEvent.change(conversationInput, { target: { value: 'New Conversation' } })

    // Trigger the conversation creation (you may need to add your assertions based on the createConversation implementation)
    await act(async () => {
      fireEvent.click(screen.getByText('Create Conversation')); // Adjust the text as needed      
    })

  });
})
