import React, { useEffect, useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'
import Message from "../../Components/ChatRoom/message"
import { disconnect } from '../../functions/disconnect'
import UserProfile from '../../Components/userProfile/userProfile'
import '../../css/pages/chatRoomPage.scss'

const AccessingReportedConversationPopupContent = ({ reportedConversationId }) => {
  const [currentConversation, setCurrentConversation] = useState('')
  const [isFetched, setIsFetched] = useState(false)
  const [messages, setMessages] = useState([])

  const fetchConversations = async (changeConversation = true) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
    console.log(response.status)
    if (response.status === 401) {
      disconnect()
    } else {
      const data = await response.json()
      const conv = data.find(item => item._id === reportedConversationId)
      const convParticipants = conv.participants
      const convName = []
      convParticipants.map((participant) => (
        convName.push(participant.firstname + ' ' + participant.lastname)
      ))
      setCurrentConversation({
        _id: conv._id,
        date: conv.date,
        participants: conv.participants,
        name: conv.title !== 'placeholder title' ? conv.title : convName.join(', ')
      })
      fetchMessages()
    }
  }

  const fetchMessages = async () => {

    try {
      if (!currentConversation) {
        return
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/chat/${reportedConversationId}/messages`,
        {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      )
      setIsFetched(true)

      if (response.status === 401) {
        disconnect()
      }
      if (!response.ok) /* istanbul ignore next */ {
        throw new Error('Erreur lors de la récupération des messages.')
      } else {
        const data = await response.json()
        const messageData = data.map((message) => ({
          contentType: !message.file ? 'text' : 'file',
          ...message
        }))
        setMessages(messageData)
      }
    } catch (error) /* istanbul ignore next */ {
      console.error('Erreur lors de la récupération des messages :', error)
    }
  }

  useEffect(() => {
    if (!isFetched) {
      fetchConversations()
    }
  }, [fetchConversations])

  const truncateString = (str) => {
    return str.length > 25 ? str.slice(0, 30) + '...' : str;
  };

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
                        <Message key={index} next={messages[index + 1]} message={message} participants={currentConversation.participants} />
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
            <div>Aucune conversation sélectionnée.</div>
            )}
      </div>
    </div>
  )
}

export default AccessingReportedConversationPopupContent
