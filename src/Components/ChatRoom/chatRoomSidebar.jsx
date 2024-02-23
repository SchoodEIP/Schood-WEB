import {WebsocketContext} from "../../contexts/websocket";
import React, {useContext, useEffect} from "react";

const ChatRoomSidebar = ({
  conversations,
  currentConversation,
  setCurrentConversation,
  clearMessageAndError,
  openCreateConversationPopup
}) => {
  const { chats } = useContext(WebsocketContext)
  
  useEffect(() => {
    chats.removeChatFromUnseen(currentConversation._id)
  }, [chats.value.notified, chats.value.unseenChats, currentConversation]);

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
          >{
            (chats.value.unseenChats.includes(conversation._id)) &&
            <div className="conversation-notification" />
          }
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
