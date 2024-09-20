import ChatRoomSidebar from '../../../Components/ChatRoom/chatRoomSidebar'
import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('ChatRoomSidebar', () => {
  const conversations = [
    { name: 'Conversation 2', _id: 0 },
    { name: 'Conversation 3', _id: 1 },
    { name: 'Conversation 1', _id: 2 }
  ]

  it('renders the component with conversations', async () => {
    const currentConversation = conversations[0]
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()
    const setCurrentParticipants = jest.fn()

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ChatRoomSidebar
              conversations={conversations}
              currentConversation={currentConversation}
              setCurrentConversation={setCurrentConversation}
              setCurrentParticipants={setCurrentParticipants}
              clearMessageAndError={clearMessageAndError}
              openCreateConversationPopup={openCreateConversationPopup}
            />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Check if the component renders with the correct conversations
    conversations.forEach((conversation) => {
      const conversationElement = screen.getByText(conversation.name)
      expect(conversationElement).toBeInTheDocument()
    })

    // // Check if the active conversation is highlighted
    // const activeConversationElement = screen.getByText(currentConversation.name)
    // expect(activeConversationElement).toHaveClass('conversation active-conversation')

    // Check if the "+ Nouvelle conversation" button is present
    const newConversationButton = screen.getByText('+ Nouvelle conversation')
    expect(newConversationButton).toBeInTheDocument()
  })

  it('calls setCurrentConversation and clearMessageAndError when a conversation is clicked', async () => {
    const currentConversation = conversations[0]
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()
    const setCurrentParticipants = jest.fn()

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ChatRoomSidebar
              conversations={conversations}
              currentConversation={currentConversation}
              setCurrentConversation={setCurrentConversation}
              setCurrentParticipants={setCurrentParticipants}
              clearMessageAndError={clearMessageAndError}
              openCreateConversationPopup={openCreateConversationPopup}
            />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Click on a conversation
    const conversationToClick = screen.getByText(conversations[1].name)
    fireEvent.click(conversationToClick)

    // Check if setCurrentConversation was called with the correct conversation
    expect(setCurrentConversation).toHaveBeenCalledWith(conversations[1])

    // Check if clearMessageAndError was called
    expect(clearMessageAndError).toHaveBeenCalled()
  })

  it('calls openCreateConversationPopup when "+ Nouvelle conversation" button is clicked', async () => {
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ChatRoomSidebar
              conversations={[]}
              currentConversation={null}
              setCurrentConversation={setCurrentConversation}
              clearMessageAndError={clearMessageAndError}
              openCreateConversationPopup={openCreateConversationPopup}
            />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Click on the "+ Nouvelle conversation" button
    const newConversationButton = screen.getByText('+ Nouvelle conversation')
    fireEvent.click(newConversationButton)

    // Check if openCreateConversationPopup was called
    expect(openCreateConversationPopup).toHaveBeenCalled()
  })
})
