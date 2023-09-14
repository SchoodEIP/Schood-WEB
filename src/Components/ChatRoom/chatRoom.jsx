import React, { useState, useEffect } from 'react'
import '../../css/pages/chatRoomPage.scss'
import Message from './message'
import ChatRoomSidebar from './chatRoomSidebar'
import CreateConversationPopup from './createConversationPopup'

const Messages = () => {
  const [conversations, setConversations] = useState([])

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
      for (let i = 0; i < data.length; i++) {
        let convName = ''
        for (let j = 0; j < (data[i].participants.length); j++) {
          convName += data[i].participants[j].firstname + ' ' + data[i].participants[j].lastname
          if (j < (data[i].participants.length - 1)) {
            convName += ', '
          }
        }
        conversations.push({
          _id: data[i]._id,
          name: convName
        })
      }
    }
    fetchConversations()
  }, [conversations])
  const [currentConversation, setCurrentConversation] = useState(
    conversations[conversations.length - 1]
  )
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
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/messages`, {
            method: 'GET',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          })
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des messages.')
        }
        const data = await response.json()
        const messageData = []
        for (let i = 0; i < data.length; i++) {
          messageData.push({
            contentType: 'text',
            content: data[i].content
          })
        }
        setMessages(messageData)
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error)
        // Gérer l'erreur de récupération des messages ici
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
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contacts.')
        }
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error)
        // Gérer l'erreur de récupération des contacts ici
      }
    }

    fetchContacts()
  }, [])

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) {
      return
    }

    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
    const username = 'User'
    const content = newMessage

    const messageData = { username, time, content, contentType: fileType }

    try {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }

      formData.append('messageData', JSON.stringify(messageData)) // not valid with current route it only accepts file and content for now voir avec Quentin

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/newMessage`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newMessage })
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message.")
      }

      const data = await response.json()
      const updatedMessages = [...messages, data]
      setMessages(updatedMessages)
      setNewMessage('')
      setError('')
      setFileType('text')
      setFile(null)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error)
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

  const clearMessageAndError = () => {
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
      const participantsArray = [
        userId,
        selectedContacts[0]
      ]
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // not sure which id belongs to which participant voir avec quentin
          participants: participantsArray
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la conversation.')
      }

      const data = await response.json()
      const newConversation = {
        id: data._id,
        name: conversationName
      }
      setConversations([...conversations, newConversation])
    } catch (error) {
      console.error('Erreur lors de la création de la conversation :', error)
      // Gérer l'erreur de création de la conversation ici
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
              <h2>Conversation : {currentConversation.name}</h2>
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
