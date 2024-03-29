import React, { useEffect, useState } from 'react'
import '../../css/pages/chatRoomPage.scss'
import ChatRoomSidebar from './chatRoomSidebar'
import CreateConversationPopup from './createConversationPopup'
import Message from './message'
import ReportButton from './reportButton'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setCurrentConversation(data[0])
      const conversationData = data.map((conversation) => {
        const firstParticipant = conversation.participants[0]
        const convName = `${firstParticipant.firstname} ${firstParticipant.lastname}`
        return {
          _id: conversation._id,
          name: convName
        }
      })
      setConversations(conversationData)
    }
    fetchConversations()
  }, [])

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const [showCreateConversationPopup, setShowCreateConversationPopup] = useState(false)
  const [contacts, setContacts] = useState([])
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('text')

  useEffect(() => {
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
        if (!response.ok) /* istanbul ignore next */ {
          throw new Error('Erreur lors de la récupération des messages.')
        }
        const data = await response.json()
        const messageData = data.map((message) => ({
          contentType: !message.file ? 'text' : 'file',
          ...message
        }))
        setMessages(messageData)
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération des messages :', error)
      }
    }

    fetchMessages()
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
        if (!response.ok) /* istanbul ignore next */ {
          throw new Error('Erreur lors de la récupération des contacts.')
        }
        const data = await response.json()
        setContacts(data)
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
      username: 'User',
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

        if (response.status !== 200) /* istanbul ignore next */ {
          throw new Error("Erreur lors de l'envoi du message.")
        }
      }

      const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      const message = {
        username: 'User',
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
        username: 'User',
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
    setShowCreateConversationPopup(true)
  }

  const closeCreateConversationPopup = () => {
    setShowCreateConversationPopup(false)
  }

  const createConversation = async (conversationName, selectedContacts) => {
    try {
      const userId = localStorage.getItem('id')
      const participantsArray = [userId, selectedContacts[0]]
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: participantsArray
        })
      })

      if (!response.ok) /* istanbul ignore next */ {
        throw new Error('Erreur lors de la création de la conversation.')
      }

      const data = await response.json()
      const newConversation = {
        id: data._id,
        name: conversationName
      }
      setConversations([...conversations, newConversation])
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
          setFileType('image')
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

  return (
    <div className='messaging-page'>
      <ChatRoomSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />

      <div className='chat'>
        {currentConversation
          ? (
            <div>
              <h2>Conversation : {currentConversation.name ? currentConversation.name.split(',')[0] : ''}</h2>
              <ReportButton currentConversation={currentConversation} />
              <div className='message-list'>
                {messages.map((message, index) => (
                  <Message key={index} message={message} />
                ))}
                {error && <div className='error-message'>{error}</div>}
              </div>
              <div className='message-input'>
                <input
                  type='text'
                  placeholder='Composez votre message'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <label className='file-input-label'>
                  <input
                    type='file'
                    accept='.jpg, .jpeg, .png, .pdf, .zip, .txt'
                    onChange={handleFileChange}
                  />
                  <span className='file-input-button'>+</span>
                </label>
                <button className='send-button' onClick={sendMessage}>
                  Envoyer
                </button>
              </div>
            </div>
            )
          : (
            <div>Aucune conversation sélectionnée.</div>
            )}
      </div>
      {showCreateConversationPopup && (
        <CreateConversationPopup
          contacts={contacts}
          createConversation={createConversation}
          closeCreateConversationPopup={closeCreateConversationPopup}
        />
      )}
    </div>
  )
}

export default Messages
