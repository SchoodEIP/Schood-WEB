import Messages from '../../../Components/ChatRoom/chatRoom'
import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import '@testing-library/jest-dom/'

describe('Messages Component', () => {
  const id = 123
  const chatUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat`
  const chatMessagesUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/messages`
  const contactUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/users`
  const newFile = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newFile`
  const newMessage = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newMessage`
  const getFileUrl = `${process.env.REACT_APP_BACKEND_URL}/user/file/0`
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(chatUrl, {
      body: [{
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
      }],
      status: 200
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
    fetchMock.get(getFileUrl, { body: 'image' })
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.restore()
  })

  it('shows the conversations', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that the component renders
    const composeMessageInput = screen.queryByText('teacher1 teacher1, teacher2 teacher2')
    expect(composeMessageInput).toBeInTheDocument()
  })

  it('displays an error message when message sending fails', async () => {
    await act(async () => {
      render(<Messages />)
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    const composeMessageInput = screen.getByPlaceholderText('Composez votre message')
    fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    fireEvent.click(screen.getByText('Envoyer'))

    // Wait for error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('sends a message- in chatroom', async () => {
    await act(async () => {
      render(<Messages />)
    })
    const input = screen.getByPlaceholderText('Composez votre message')

    // Type a message in the input field
    fireEvent.change(input, { target: { value: 'Hello, world!' } })

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })

    await waitFor(async () => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    })
  })

  it('handles file uploading', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that file input is present
    const fileInput = screen.getByLabelText('+')
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })

    // Ensure that file type is set
    await waitFor(async () => {
      const fileTypeElement = screen.getByText('User')
      expect(fileTypeElement).toBeInTheDocument()
    })
  })

  it('handles file error', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that file input is present
    const fileInput = screen.getByLabelText('+')
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })

    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })

    // Wait for error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('shows an error', async () => {
    await act(async () => {
      render(<Messages />)
    })
    const fileInput = screen.getByLabelText('+')
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })

    const input = screen.getByPlaceholderText('Composez votre message')

    await act(async () => {
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    })

    // Wait for error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.queryByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
      expect(errorMessage).not.toBeInTheDocument()
    })
  })  

  it('creates a new conversation', async () => {
    await act(async () => {
      render(<Messages />);
    });
  
    // Trigger the creation of a new conversation (you may need to add a button or UI element for this)
    // Ensure that the new conversation appears in the conversations list
  
    await waitFor(() => {
      const newConversationButton = screen.getByText('Nouvelle conversation', { selector: 'button' });
      expect(newConversationButton).toBeInTheDocument();
    });    
  });

  it('sets file type to "pdf" for a PDF file', async () => {
    await act(async () => {
      render(<Messages />);
    });
  
    // Simulate selecting a PDF file
    const fileInput = screen.getByLabelText('+');
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.pdf')] } });
  
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  });
  
  it('sets file type to "other" for a other file', async () => {
    await act(async () => {
      render(<Messages />);
    });
  
    // Simulate selecting a PDF file
    const fileInput = screen.getByLabelText('+');
    fireEvent.change(fileInput, { target: { files: [new File([], 'test.other')] } });
  
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  });  
})
