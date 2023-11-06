import '../../css/pages/chatRoomPage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import ChatRoom from '../../Components/ChatRoom/chatRoom'
import React from 'react'

const ChatRoomPage = () => {
  return (
    <div className='form-page'>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div><ChatRoom /></div>
        </div>
        <div>
          <HeaderComp />
        </div>
      </div>
    </div>
  )
}

export default ChatRoomPage
