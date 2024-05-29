import '../../css/pages/chatRoomPage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import ChatRoom from '../../Components/ChatRoom/chatRoom'
import React from 'react'

const ChatRoomPage = () => {
  return (
    <div className='chat-page'>
      <div className='header'>
        <HeaderComp
          title='Mes messages'
        />
      </div>
      <div className='content'>
        <ChatRoom />
      </div>
    </div>
  )
}

export default ChatRoomPage
