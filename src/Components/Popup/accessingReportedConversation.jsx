import React, { useEffect, useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'
import Message from '../../Components/ChatRoom/message'
import UserProfile from '../../Components/userProfile/userProfile'
import '../../css/pages/chatRoomPage.scss'

const AccessingReportedConversationPopupContent = ({ signaledBy, reportedConversation }) => {
  const [currentConversation, setCurrentConversation] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const convParticipants = reportedConversation.participants.map(participant => participant.user)
    const convName = []
    convParticipants.map((participant) => (
      convName.push(participant.firstname + ' ' + participant.lastname)
    ))
    setCurrentConversation({
      _id: reportedConversation._id,
      date: reportedConversation.date,
      participants: convParticipants,
      name: reportedConversation.title !== 'placeholder title' ? reportedConversation.title : convName.join(', ')
    })

    const messageData = reportedConversation.messages.map((message) => ({
      contentType: !message.file ? 'text' : 'file',
      ...message
    }))
    setMessages(messageData)
  }, [reportedConversation, signaledBy])

  const truncateString = (str) => {
    return str.length > 25 ? str.slice(0, 30) + '...' : str
  }

  return (
    <div className='messaging-popup'>
      <div className='chat'>
        {currentConversation
          ? (
            <div className='chat-content'>
              <div className='top'>
                <div className='top-info'>
                  <div className='conv-name' title={currentConversation.name}>{truncateString(currentConversation.name)}</div>
                  <div className='participants-container'>
                    {currentConversation.participants.length} {currentConversation.participants.length > 1 ? 'membres' : 'membre'}
                  </div>
                </div>
              </div>
              <div className='bottom'>
                <div className='left'>
                  <div className='top2'>
                    <div className='message-list'>
                      {messages.map((message, index) => (
                        <Message key={index} message={message} participants={currentConversation.participants} next={messages[index + 1]} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='right'>
                  {currentConversation.participants.map((participant, indexP) => (
                    <div className='user-profile' key={indexP}>
                      <UserProfile
                        fullname
                        profile={participant}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )
          : (
            <div>Cette converssation n'est pas disponible actuellement.</div>
            )}
      </div>
    </div>
  )
}

export default AccessingReportedConversationPopupContent
