import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../css/pages/chatRoomPage.scss'
import ChatRoomSidebar from './chatRoomSidebar'
import Message from './message'
import ReportButton from './reportButton'
import { WebsocketContext } from '../../contexts/websocket'
import Popup from 'reactjs-popup'
import addFile from '../../assets/add_file.png'
import ConversationCreationPopupContent from '../Popup/conversationCreation'
import '../../css/Components/Popup/popup.scss'
import cross from '../../assets/Cross.png'
import { disconnect } from '../../functions/disconnect'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState('')
  const [currentParticipants, setCurrentParticipants] = useState('')
  const { send, chats } = useContext(WebsocketContext) // eslint-disable-line
  const inputFile = useRef(null)

  const fetchConversations = async (changeConversation = true) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      disconnect()
    } else {
      const data = await response.json()

      const conversationData = data.map((conversation) => {
        const noUserParticipants = conversation.participants.filter(element => element._id !== localStorage.getItem('id'))
        const convName = []
        noUserParticipants.map((participant) => (
          convName.push(participant.firstname + ' ' + participant.lastname)
        ))
        setCurrentParticipants(convName.join(', '))
        return {
          _id: conversation._id,
          participants: conversation.participants,
          name: conversation.title !== 'placeholder title' ? conversation.title : convName.join(', ')
        }
      })
      if (currentConversation === '' || changeConversation) {
        setCurrentConversation(conversationData[conversationData.length - 1])
      }
      setConversations(conversationData)
    }
  }

  const fetchMessages = async () => {
    try {
      if (!currentConversation) {
        return
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/messages`,
        {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      )
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
    if (chats?.value.unseenChats.includes(currentConversation._id)) fetchMessages()
  }, [chats?.value.unseenChats])

  useEffect(() => {
    if (chats) fetchConversations(!chats.value.newChat)
  }, [chats?.value.newChat])

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const [showCreateConversationPopup, setShowCreateConversationPopup] = useState(false)
  const [contacts, setContacts] = useState([])
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('text')

  useEffect(() => {
    fetchMessages()

    const intervalId = setInterval(() => {
      fetchMessages()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [currentConversation])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/users`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          disconnect()
        }
        if (!response.ok) /* istanbul ignore next */ {
          throw new Error('Erreur lors de la récupération des contacts.')
        } else {
          const data = await response.json()
          setContacts(data)
        }
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération des contacts :', error)
      }
    }

    fetchContacts()
  }, [])

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) {
      return
    }

    const currentTime = new Date()
    const messageData = {
      user: localStorage.getItem('id'),
      time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: currentTime.toLocaleDateString(),
      content: newMessage,
      contentType: fileType
    }

    try {
      const formData = new FormData()
      formData.append('messageData', JSON.stringify(messageData))

      if (file) {
        const fileData = new FormData()
        fileData.append('file', file)
        fileData.append('content', newMessage)

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/newFile`,
          {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token')
            },
            body: fileData
          }
        )
        if (response.status !== 200) /* istanbul ignore next */ {
          throw new Error("Erreur lors de l'envoi du message.")
        } else {
          send('messageChat', { id: currentConversation._id, userId: localStorage.getItem('id') })
        }
      } else {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/newMessage`,
          {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newMessage })
          }
        )

        if (response.status === 401) {
          disconnect()
        }

        if (response.status !== 200) /* istanbul ignore next */ {
          throw new Error("Erreur lors de l'envoi du message.")
        } else {
          send('messageChat', { id: currentConversation._id, userId: localStorage.getItem('id') })
        }
      }

      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      const message = {
        user: localStorage.getItem('id'),
        time,
        content: newMessage,
        contentType: fileType,
        error: true
      }
      const updatedMessages = [...messages, message]
      setMessages(updatedMessages)
      setNewMessage('')
      setFileType('text')
      setFile(null)
    } catch (error) {
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.")

      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      const message = {
        user: localStorage.getItem('id'),
        time,
        content: newMessage,
        contentType: fileType,
        error: true
      }
      const updatedMessages = [...messages, message]
      setMessages(updatedMessages)
      setNewMessage('')
      setFileType('text')
      setFile(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const clearMessageAndError = () => /* istanbul ignore next */ {
    setMessages([])
    setError('')
  }

  const openCreateConversationPopup = () => {
    setShowCreateConversationPopup(!showCreateConversationPopup)
  }

  const createConversation = async (convTitle, selectedContacts) => {
    try {
      const userId = localStorage.getItem('id')
      selectedContacts.unshift(userId)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: convTitle,
          participants: selectedContacts
        })
      })
      if (response.status === 401) {
        disconnect()
      }
      if (!response.ok) /* istanbul ignore next */ {
        throw new Error('Erreur lors de la création de la conversation.')
      }

      send('createChat', { ids: selectedContacts.filter((id) => id !== userId) })
      fetchConversations()
    } catch (error) /* istanbul ignore next */ {
      setError('Erreur lors de la création de la conversation')
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          setFileType('file')
          break
        case 'pdf':
          setFileType('pdf')
          break
        case 'zip':
          setFileType('zip')
          break
        default:
          setFileType('other')
      }
    }
  }

  const openInputFile = () => {
    inputFile.current.click()
  }

  const handleClearFile = (e) => {
    setFile(null)
  }

  return (
    <div className='messaging-page'>
      <ChatRoomSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        setCurrentParticipants={setCurrentParticipants}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />
      <div className='chat'>
        {currentConversation
          ? (
            <div className='chat-content'>
              <div className='top'>
                <div className='top-info'>
                  <div className='conv-name'>{currentConversation.name}</div>
                  <div className='participants-container'>
                    {currentParticipants}
                  </div>
                </div>
                <Popup trigger={<button className='report-btn'>Signaler</button>} modal>
                  <div className='popup-modal-container'>
                    <ReportButton
                      currentConversation={currentConversation}
                    />
                  </div>
                </Popup>
              </div>
              <div className='bottom'>
                <div className='top2'>
                  <div className='message-list'>
                    {messages.map((message, index) => (
                      <Message key={index} next={messages[index + 1]} message={message} participants={currentConversation.participants} />
                    ))}
                    {error && <div className='error-message'>{error}</div>}
                  </div>
                </div>
                <div className='bottom2'>
                  <div className='column'>
                    {file && (
                      <div className='file-name'>
                        <div>{file.name}</div>
                        <button data-testid='clear-btn' className='send-button' onClick={handleClearFile}>X</button>
                      </div>
                    )}
                    <div className='message-input'>
                      <div className='file-input'>
                        <input
                          type='file'
                          accept='.jpg, .jpeg, .png, .pdf, .zip, .txt'
                          onChange={handleFileChange}
                          ref={inputFile}
                        />
                        <img src={addFile} onClick={openInputFile} alt='add file' />
                      </div>
                      <div className='message-area'>
                        <input
                          type='text'
                          placeholder='Message...'
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <button className='send-button' onClick={sendMessage}>
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div>Aucune conversation sélectionnée.</div>
            )}
      </div>
      <Popup open={showCreateConversationPopup} onClose={openCreateConversationPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <ConversationCreationPopupContent contacts={contacts} createConversation={createConversation} closeCreateConversationPopup={close} />
          </div>
        )}
      </Popup>
    </div>
  )
}

export default Messages
