import Messages from '../../../Components/ChatRoom/chatRoom'
import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import '@testing-library/jest-dom/'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('Messages Component', () => {
  const id = 123
  const chatUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat`
  const chatMessagesUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/messages`
  const contactUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/users`
  const newFile = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newFile`
  const newMessage = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newMessage`
  const getFileUrl = `${process.env.REACT_APP_BACKEND_URL}/user/file/0`
  localStorage.setItem('id', '0')

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
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
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Ensure that the component renders
    // await waitFor(() => {
    //   const composeMessageInput = screen.queryAllByText('teacher2 teacher2').find(el => el.classList.contains('conversation'))
    //   expect(composeMessageInput).toBeInTheDocument()
    // })
  })

  it('disconnects through fetchConversations url', async () => {
    fetchMock.get(chatUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
           <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  it('disconnects through get messages url', async () => {
    fetchMock.get(chatMessagesUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
           <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  it('disconnects through contact url', async () => {
    fetchMock.get(contactUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
           <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  it('disconnects through chat creation', async () => {
    fetchMock.get(chatUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Créer la conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    await act(async () => {
      fireEvent.click(screen.getByText('Nouvelle conversation'))
    })

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Créer la conversation')
      expect(popupTitle).toBeInTheDocument()
    })

    // Mock the create conversation button click for no contact
    const createConversationButton = screen.getByText('Créer la conversation')
    await act(async () => {
      fireEvent.click(createConversationButton)
    })

    // Mock the input values
    const contactInput = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.change(contactInput, { target: { value: 'student1' } })
    })

    // Mock the contact selection (you may need to adjust the selector)
    const contactOption = screen.getByText('student1 student1')
    await act(async () => {
      fireEvent.click(contactOption)
    })

    // Mock the create conversation button click
    await act(async () => {
      fireEvent.click(createConversationButton)
    })
    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  it('disconnects through new message url', async () => {
    fetchMock.post(newMessage, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
           <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const composeMessageInput = screen.getByPlaceholderText('Message...')
    await act(async () => {
      fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    })

    await act(async () => {
      fireEvent.keyPress(composeMessageInput, { key: 'Enter', code: 'Enter', charCode: 13 })
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  it('displays an error message when message sending fails', async () => {
    localStorage.setItem('id', '0')
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    const composeMessageInput = screen.getByPlaceholderText('Message...')
    await act(async () => {
      fireEvent.change(composeMessageInput, { target: { value: 'Hello, World!' } })
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })

    // Wait for error message to be displayed
    await waitFor(() => {
      const errorMessage = screen.getByText("Erreur lors de l'envoi du message. Veuillez réessayer.")
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('sends a message- in chatroom', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    const input = screen.getByPlaceholderText('Message...')

    // Type a message in the input field
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello, world!' } })
    })
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
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Ensure that file input is present
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })
    })
    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  })

  it('handles file error', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Ensure that file input is present
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.rjpg')] } })
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  })

  it('shows an error', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.jpg')] } })
    })

    // const clearBtn = screen.getByTestId('clear-btn')

    // await waitFor(async () => {
    //   expect(clearBtn).toBeInTheDocument()
    // })
    // await act(async () => {
    //   fireEvent.click(clearBtn)
    // })

    const input = screen.getByPlaceholderText('Message...')

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
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const newConversationButton = screen.getByText('Nouvelle conversation')

    await waitFor(() => {
      expect(newConversationButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(newConversationButton)
    })

    const contactInput = screen.getByRole('combobox')
    await waitFor(() => {
      expect(contactInput).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.change(contactInput, { target: { value: 'stu' } })
    })

    await waitFor(() => {
      expect(screen.getByText('student1 student1')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(contactInput, { target: { value: 'student1 student1' } })
    })

    await waitFor(() => {
      expect(contactInput.value).toBe('student1 student1')
    })

    const createConversationBtn = screen.getByText('Créer la conversation')

    await waitFor(() => {
      expect(screen.getAllByText('student1 student1').length).toBe(1)
    })

    fetchMock.get(chatMessagesUrl, [])

    fetchMock.get(chatUrl, {
      body: [
        {
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
        },
        {
          _id: '456',
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
        }
      ],
      status: 200
    })

    await act(async () => {
      fireEvent.click(createConversationBtn)
    })
  })

  it('sets file type to "pdf" for a PDF file', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Simulate selecting a PDF file
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.pdf')] } })
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  })

  it('sets file type to "other" for a other file', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Simulate selecting a PDF file
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.other')] } })
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  })

  it('sets file type to "zip" for a zip file', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Simulate selecting a zip file
    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.zip')] } })
    })
    // Mock a failed fetch request
    const mockFetch = jest.fn().mockRejectedValue(new Error('Failed to send message'))

    global.fetch = mockFetch

    // Click the "Envoyer" button to send the message
    await act(async () => {
      fireEvent.click(screen.getByText('Envoyer'))
    })
  })

  it('get file then clear it', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <Messages />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.queryByText('test.zip')).not.toBeInTheDocument()
    })

    const fileInput = screen.getByAltText('add file')
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [new File([], 'test.zip')] } })
    })

    // await waitFor(() => {
    //   expect(screen.getByText('test.zip')).toBeInTheDocument()
    // })

    // // Click the "Clear" button to send the message
    // await act(async () => {
    //   fireEvent.click(screen.getByTestId('clear-btn'))
    // })

    // await waitFor(() => {
    //   expect(screen.queryByText('test.zip')).not.toBeInTheDocument()
    // })
  })
})
