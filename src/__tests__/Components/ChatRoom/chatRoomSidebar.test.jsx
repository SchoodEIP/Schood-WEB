import ChatRoomSidebar from '../../../Components/ChatRoom/chatRoomSidebar'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'

describe('ChatRoomSidebar', () => {
  it('renders the component with conversations', () => {
    const conversations = [
      { name: 'Conversation 1' },
      { name: 'Conversation 2' },
      { name: 'Conversation 3' }
    ]
    const currentConversation = conversations[0]
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()

    render(
      <ChatRoomSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />
    )

    // Check if the component renders with the correct conversations
    conversations.forEach((conversation) => {
      const conversationElement = screen.getByText(conversation.name)
      expect(conversationElement).toBeInTheDocument()
    })

    // Check if the active conversation is highlighted
    const activeConversationElement = screen.getByText(currentConversation.name)
    expect(activeConversationElement).toHaveClass('active')

    // Check if the "Nouvelle conversation" button is present
    const newConversationButton = screen.getByText('Nouvelle conversation')
    expect(newConversationButton).toBeInTheDocument()
  })

  it('calls setCurrentConversation and clearMessageAndError when a conversation is clicked', () => {
    const conversations = [
      { name: 'Conversation 1' },
      { name: 'Conversation 2' },
      { name: 'Conversation 3' }
    ]
    const currentConversation = conversations[0]
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()

    render(
      <ChatRoomSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />
    )

    // Click on a conversation
    const conversationToClick = screen.getByText(conversations[1].name)
    fireEvent.click(conversationToClick)

    // Check if setCurrentConversation was called with the correct conversation
    expect(setCurrentConversation).toHaveBeenCalledWith(conversations[1])

    // Check if clearMessageAndError was called
    expect(clearMessageAndError).toHaveBeenCalled()
  })

  it('calls openCreateConversationPopup when "Nouvelle conversation" button is clicked', () => {
    const conversations = []
    const currentConversation = null
    const setCurrentConversation = jest.fn()
    const clearMessageAndError = jest.fn()
    const openCreateConversationPopup = jest.fn()

    render(
      <ChatRoomSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />
    )

    // Click on the "Nouvelle conversation" button
    const newConversationButton = screen.getByText('Nouvelle conversation')
    fireEvent.click(newConversationButton)

    // Check if openCreateConversationPopup was called
    expect(openCreateConversationPopup).toHaveBeenCalled()
  })
})
