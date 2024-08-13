import { WebsocketContext } from '../../contexts/websocket'
import React, { useContext, useEffect } from 'react'
import cross from '../../assets/cross2.png'

const ChatRoomSidebar = ({
  conversations,
  currentConversation,
  setCurrentConversation,
  setCurrentParticipants,
  clearMessageAndError,
  openCreateConversationPopup
}) => {
  const { chats } = useContext(WebsocketContext)

  useEffect(() => {
    if (currentConversation) { chats?.removeChatFromUnseen(currentConversation._id) }
  }, [chats?.value.notified, chats?.value.unseenChats, currentConversation])

  const handleClick = (conversation) => {
    clearMessageAndError()
    setCurrentConversation(conversation)
    const conv = []
    conversation.participants.map((participant) => (
      conv.push(participant.firstname + ' ' + participant.lastname)
    ))
    setCurrentParticipants(conv.join(', '))
  }

  return (
    <div className='chat-sidebar'>
      <div className='top'>
        <button className='new-conversation-button' onClick={openCreateConversationPopup}>
          <img className='img-cross' src={cross} alt='cross' />
          <span>+ Nouvelle conversation</span>
        </button>
        {/* <span className='divider' /> */}
      </div>
      <div className='content'>
        {conversations.map((conversation, index) => (
          <div key={index} className={`${conversation === currentConversation ? 'active-conversation' : 'conversation'}`} onClick={() => handleClick(conversation)}>
            <div className='text'>
              {conversation.name}
            </div>
            {
              (chats.value.unseenChats.includes(conversation._id)) &&
                <div className='conversation-notification' />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatRoomSidebar
