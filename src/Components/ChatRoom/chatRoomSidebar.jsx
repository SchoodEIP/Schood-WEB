import React from 'react'

const ChatRoomSidebar = ({
  conversations,
  currentConversation,
  setCurrentConversation,
  clearMessageAndError,
  openCreateConversationPopup
}) => {
  const handleClick = (conversation) => {
    setCurrentConversation(conversation)
    clearMessageAndError()
  }

  return (
    <div className='sidebar'>
      <h2>Mes messages</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <div
            key={index}
            className={`conversation ${conversation === currentConversation ? 'active-conversation' : ''}`}
            onClick={() => handleClick(conversation)}
          >
            {conversation.name}
          </div>
        ))}
      </ul>
      <button className='new-conversation-button' onClick={openCreateConversationPopup}>
        Nouvelle conversation
      </button>
    </div>
  )
}

export default ChatRoomSidebar
