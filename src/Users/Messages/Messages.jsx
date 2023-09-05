import React, { useState, useEffect } from 'react'
import './Messages.scss'

const Message = ({ message }) => {
  return (
    <div className='message'>
      <div className='message-header'>
        <span className='message-username'>{message.username}</span>
        <span className='message-time'>{message.time}</span>
      </div>
      <div className='message-content'>
        {message.contentType === 'text'
          ? (
              message.content
            )
          : (
            <a href={message.fileUrl} target='_blank' rel='noopener noreferrer'>
              Fichier joint
            </a>
            )}
      </div>
    </div>
  )
}

const Sidebar = ({
  conversations,
  currentConversation,
  setCurrentConversation,
  clearMessageAndError,
  openCreateConversationPopup
}) => {
  const handleClick = (conversation) => {
    setCurrentConversation(conversation)
    clearMessageAndError()
  }

  return (
    <div className='sidebar'>
      <h2>Mes messages</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <li
            key={index}
            className={conversation === currentConversation ? 'active' : ''}
            onClick={() => handleClick(conversation)}
          >
            {conversation.name}
          </li>
        ))}
      </ul>
      <button className='new-conversation-button' onClick={openCreateConversationPopup}>
        Nouvelle conversation
      </button>
    </div>
  )
}

const CreateConversationPopup = ({
  contacts,
  createConversation,
  closeCreateConversationPopup
}) => {
  const [searchInput, setSearchInput] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleContactSelection = (contactId) => {
    console.log(contactId)
    // we need to automatically fill the input with the name of the select contact
    setSelectedContacts((prevSelectedContacts) => {
      if (prevSelectedContacts.includes(contactId)) {
        return prevSelectedContacts.filter((id) => id !== contactId)
      } else {
        return [...prevSelectedContacts, contactId]
      }
    })
  }

  const handleCreateConversation = () => {
    const newConversationName = searchInput.trim()
    console.log(newConversationName)
    if (newConversationName === '') {
      return
    }
    console.log(selectedContacts)

    createConversation(newConversationName, selectedContacts)
    closeCreateConversationPopup()
  }

  return (
    <div className='popup'>
      <div className='popup-content'>
        <h2>Nouvelle conversation</h2>
        <input
          type='text'
          placeholder='Rechercher un contact'
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <ul> {/** maybe use a datalist instead of a list */}
          {contacts.map((contact) => (
            <li
              style={{ cursor: 'pointer' }}
              key={contact._id}
              className={selectedContacts.includes(contact._id) ? 'selected' : ''}
              onClick={() => handleContactSelection(contact._id)}
            >
              {contact.firstname + ' ' + contact.lastname}
            </li>
          ))}
        </ul>
        <button className='new-conversation-button' onClick={handleCreateConversation}>
          Créer la conversation
        </button>
        <button className='new-conversation-button' onClick={closeCreateConversationPopup}>
          Annuler
        </button>
      </div>
    </div>
  )
}

const Messages = () => {
  
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      for (let i = 0; i < data.length; i++ ) {
        let conv_name = ""
        for (let j = 0; j < (data[i].participants.length); j++) {
          conv_name += data[i].participants[j].firstname + " " + data[i].participants[j].lastname
          if (j < (data[i].participants.length - 1)) {
            conv_name += ", "
          }
        }
        conversations.push({
          _id: data[i]._id,
          name: conv_name
        })
      }

    };
    fetchConversations();
  }, [conversations]);
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
        let message_data = [];
        for (let i = 0; i < data.length; i++) {
          message_data.push({
            contentType: 'text',
            content: data[i].content
          })
        }
        console.log(data)
        setMessages(message_data)
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
        console.log(data)
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
        body: JSON.stringify({content: newMessage})
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message.")
      }

      const data = await response.json()
      console.log(data)
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
      const user_id = localStorage.getItem('id')
      console.log(conversationName)
      const participants_array = [
        user_id,
        selectedContacts[0]
      ]
      console.log(participants_array)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // not sure which id belongs to which participant voir avec quentin
          participants: participants_array
        })
      })

      console.log(response)
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
      <Sidebar
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
