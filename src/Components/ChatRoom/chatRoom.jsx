import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../css/pages/chatRoomPage.scss'
import ChatRoomSidebar from './chatRoomSidebar'
import Message from './message'
import ReportButton from './reportButton'
import { WebsocketContext } from '../../contexts/websocket'
import Popup from 'reactjs-popup'
import UserProfile from '../userProfile/userProfile'
import addFile from '../../assets/add_file.png'
import ConversationCreationPopupContent from '../Popup/conversationCreation'
import '../../css/Components/Popup/popup.scss'
import cross from '../../assets/Cross.png'
import { disconnect } from '../../functions/disconnect'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState('')
  const [currentParticipants, setCurrentParticipants] = useState('')
  const { send, chats } = useContext(WebsocketContext)
  const inputFile = useRef(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const [contacts, setContacts] = useState([])
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('text')

  const [showCreateConversationPopup, setShowCreateConversationPopup] = useState(false)
  const [notification, setNotification] = useState(null)

  const [showAddParticipantsPopup, setShowAddParticipantsPopup] = useState(false)
  const [showLeaveConversationPopup, setShowLeaveConversationPopup] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchConversations()
    }, 10000) // Mettre à jour toutes les 10 secondes (10000 ms)

    return () => clearInterval(intervalId)
  }, [])

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
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contacts.')
        } else {
          const data = await response.json()
          setContacts(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error)
      }
    }

    fetchContacts()
  }, [])

  const fetchConversations = async () => {
    try {
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

        if (!Array.isArray(data)) {
          console.error('Fetch conversations: Response data is not an array')
          return
        }

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

        if (currentConversation === '' || !conversationData.some(conv => conv._id === currentConversation._id)) {
          setCurrentConversation(conversationData.length > 0 ? conversationData[conversationData.length - 1] : '')
        }
        setConversations(conversationData)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
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
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages.')
      } else {
        const data = await response.json()
        const messageData = data.map((message) => ({
          contentType: !message.file ? 'text' : 'file',
          ...message
        }))
        setMessages(messageData)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages :', error)
    }
  }

  useEffect(() => {
    if (chats?.value.unseenChats.includes(currentConversation._id)) fetchMessages()
  }, [chats?.value.unseenChats])

  useEffect(() => {
    if (chats) fetchConversations(!chats.value.newChat)
  }, [chats?.value.newChat])

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
        if (response.status !== 200) {
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

        if (response.status !== 200) {
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

  const clearMessageAndError = () => {
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
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la conversation.')
      }

      send('createChat', { ids: selectedContacts.filter((id) => id !== userId) })
      fetchConversations()
      setNotification({ type: 'success', message: 'Conversation créée avec succès' })
      clearNotification() // Effacer la notification après un certain temps
    } catch (error) {
      setError('Erreur lors de la création de la conversation')
      setNotification({ type: 'error', message: 'Erreur lors de la création de la conversation' })
      clearNotification() // Effacer la notification après un certain temps
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

  const clearNotification = () => {
    setTimeout(() => {
      setNotification(null)
    }, 5000) // Efface la notification après 5 secondes
  }

  const renderNotification = () => {
    if (!notification) return null

    let notificationClass = 'notification'
    if (notification.type === 'success') {
      notificationClass += ' success' // Ajouter une classe spécifique pour les notifications de succès
    } else if (notification.type === 'error') {
      notificationClass += ' error' // Ajouter une classe spécifique pour les notifications d'erreur
    }

    return (
      <div className={notificationClass}>
        {notification.message}
      </div>
    )
  }

  const addParticipants = async (selectedContacts) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/addParticipants`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: selectedContacts
        })
      })

      if (response.status === 401) {
        disconnect()
      }

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout des participants.')
      }

      setNotification({ type: 'success', message: 'Participants ajoutés avec succès' })
      fetchConversations() // Met à jour les conversations
    } catch (error) {
      console.error('Erreur lors de l\'ajout des participants :', error)
      setNotification({ type: 'error', message: 'Erreur lors de l\'ajout des participants' })
    } finally {
      clearNotification() // Efface la notification après un certain temps
      setShowAddParticipantsPopup(false) // Ferme la popup après l'ajout
    }
  }

  // Fonction pour quitter la conversation
  const leaveConversation = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${currentConversation._id}/leave`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        disconnect()
      }

      if (!response.ok) {
        throw new Error('Erreur lors du départ de la conversation.')
      }

      setNotification({ type: 'success', message: 'Vous avez quitté la conversation.' })
      setCurrentConversation('') // Réinitialiser la conversation actuelle
      fetchConversations() // Mettre à jour la liste des conversations après avoir quitté
    } catch (error) {
      console.error('Erreur lors du départ de la conversation :', error)
      setNotification({ type: 'error', message: 'Erreur lors du départ de la conversation.' })
    } finally {
      clearNotification() // Efface la notification après un certain temps
      setShowLeaveConversationPopup(false) // Ferme la popup après avoir quitté
    }
  }

  return (
    <div className='messaging-page'>
      {renderNotification()}
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
            <div className='chat-content'>
              <div className='top'>
                <div className='conv-name'>{currentConversation.name}</div>
                <button className='add-participants-btn' onClick={() => setShowAddParticipantsPopup(true)}>
                  Ajouter des membres
                </button>
                <button className='leave-conversation-btn' onClick={() => setShowLeaveConversationPopup(true)}>
                  Quitter la conversation
                </button>

                <Popup trigger={<button className='report-btn'>Signaler</button>} modal>
                  <div className='popup-modal-container'>
                    <ReportButton
                      currentConversation={currentConversation}
                    />
                  </div>
                </Popup>
              </div>
              <div className='bottom'>
                <div className='left'>
                  <div className='top2'>
                    <div className='message-list'>
                      {messages.map((message, index) => (
                        <Message key={index} message={message} participants={currentConversation.participants} />
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
      <Popup open={showCreateConversationPopup} onClose={openCreateConversationPopup} modal>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <ConversationCreationPopupContent contacts={contacts} createConversation={createConversation} closeCreateConversationPopup={close} />
          </div>
        )}
      </Popup>
      <Popup open={showAddParticipantsPopup} onClose={() => setShowAddParticipantsPopup(false)} modal>
        {(close) => (
          <div className='popup-modal-container'>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <ConversationCreationPopupContent
              contacts={contacts}
              createConversation={addParticipants}
              closeCreateConversationPopup={close}
              isAddingParticipants
            />
          </div>
        )}
      </Popup>
      <Popup open={showLeaveConversationPopup} onClose={() => setShowLeaveConversationPopup(false)} modal>
        {(close) => (
          <div className='popup-modal-container'>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <div className='leave-conversation-popup'>
              <h2>Voulez-vous vraiment quitter cette conversation ?</h2>
              <button onClick={leaveConversation} className='confirm-leave-btn'>Confirmer</button>
              <button onClick={close} className='cancel-leave-btn'>Annuler</button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )
}

export default Messages
