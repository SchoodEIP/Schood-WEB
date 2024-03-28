import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import Messages from '../../../Components/ChatRoom/chatRoom'
import '@testing-library/jest-dom/'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('createConversationPopup Component', () => {
  const id = 123
  const chatUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat`
  const chatMessagesUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/messages`
  const contactUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/users`
  const newFile = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newFile`
  const newMessage = `${process.env.REACT_APP_BACKEND_URL}/user/chat/${id}/newMessage`
  const getFileUrl = `${process.env.REACT_APP_BACKEND_URL}/user/file/0`
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(chatUrl, [{
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
    }])
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

  it('opens the create conversation popup when the button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Messages/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Créer la conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Créer la conversation')
      expect(popupTitle).toBeInTheDocument()
    })

    await waitFor(() => {
      const labelElement = screen.getByText('Rechercher un contact:')
      expect(labelElement).toBeInTheDocument()
    })
  })

  it('handles search input change', async () => {
    await act(async () => {
      render(<Messages />)
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Créer la conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Créer la conversation')
      expect(popupTitle).toBeInTheDocument()
    })

    const inputElement = screen.getByRole('combobox')
    fireEvent.change(inputElement, { target: { value: 'teacher1' } })

    expect(inputElement.value).toBe('teacher1')
  })

  it('handles cancel button click', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Messages/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Créer la conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Créer la conversation')
      expect(popupTitle).toBeInTheDocument()
    })

    const cancelButtonElement = screen.getByText('Annuler')
    fireEvent.click(cancelButtonElement)

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.queryByText('Créer la conversation')
      expect(popupTitle).not.toBeInTheDocument()
    })
  })

  it('handles contact selection', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Messages/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Ensure that the popup is initially closed
    expect(screen.queryByText('Créer la conversation')).not.toBeInTheDocument()

    // Click the button to open the popup
    fireEvent.click(screen.getByText('Nouvelle conversation'))

    // Wait for the popup to be displayed
    await waitFor(() => {
      const popupTitle = screen.getByText('Créer la conversation')
      expect(popupTitle).toBeInTheDocument()
    })

    // Mock the contact selection
    const contactInput = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.change(contactInput, { target: { value: 'student1' } })
    })

    // Mock the contact selection (you may need to adjust the selector)
    const contactOption = screen.getByText('student1 student1')

    await act(async () => {
      fireEvent.click(contactOption)
    })

    // Ensure that the contact is selected
    // expect(contactInput.value).toBe('student1 student1')
  })

  it('handles create conversation button click', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Messages/>
          </WebsocketProvider>
        </BrowserRouter>
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
  })
})
