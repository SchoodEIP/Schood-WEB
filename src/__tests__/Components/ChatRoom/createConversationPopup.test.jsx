import CreateConversationPopup from '../../../Components/ChatRoom/createConversationPopup'
import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import Messages from '../../../Components/ChatRoom/message'
import '@testing-library/jest-dom/'

describe('createConversationPopup Component', () => {
  const id = 123
  const closeCreateConversationPopup = jest.fn()
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

  it('opens the create conversation popup when the button is clicked', async () => {
      await act(async () => {
        render(<Messages />)
      })

      // Ensure that the popup is initially closed
      expect(screen.queryAllByText('Créer la conversation')).not.toBeInTheDocument()

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
      expect(screen.queryAllByText('Créer la conversation')).not.toBeInTheDocument()

      // Click the button to open the popup
      fireEvent.click(screen.getByText('Nouvelle conversation'))

      // Wait for the popup to be displayed
      await waitFor(() => {
        const popupTitle = screen.getByText('Créer la conversation')
        expect(popupTitle).toBeInTheDocument()
      })
      render(
        <CreateConversationPopup
          contacts={contactUrl}
          createConversation={chatUrl}
        />
      )
  
      const inputElement = screen.getByPlaceholderText('Rechercher un contact')
      fireEvent.change(inputElement, { target: { value: 'teacher1' } })
  
      expect(inputElement.value).toBe('teacher1')
    })

    it('handles cancel button click', async () => {
      await act(async () => {
        render(<Messages />)
      })

      // Ensure that the popup is initially closed
      expect(screen.queryAllByText('Créer la conversation')).not.toBeInTheDocument()

      // Click the button to open the popup
      fireEvent.click(screen.getByText('Nouvelle conversation'))

      // Wait for the popup to be displayed
      await waitFor(() => {
        const popupTitle = screen.getByText('Créer la conversation')
        expect(popupTitle).toBeInTheDocument()
      })
      
      render(
        <CreateConversationPopup
          contacts={contactUrl}
          createConversation={chatUrl}
          closeCreateConversationPopup={closeCreateConversationPopup}
        />
      )
  
      const cancelButtonElement = screen.getByText('Annuler')
      fireEvent.click(cancelButtonElement)
  
      expect(closeCreateConversationPopup).toHaveBeenCalled()
    })
})