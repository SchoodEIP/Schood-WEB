import React, { useState } from 'react'

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
    if (newConversationName === '') {
      return
    }

    createConversation(newConversationName, selectedContacts)
    closeCreateConversationPopup()
  }

  return (
    <div className='popup'>
      <div className='popup-content'>
        <h2>Nouvelle conversation</h2>
        <label htmlFor='contact-input'>Rechercher un contact:</label>
        <input
          type='text'
          list='contact-list'
          id='contact-input'
          placeholder='Rechercher un contact'
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <datalist id='contact-list'>
          {contacts.map((contact) => (
            <option
              key={contact._id}
              value={contact.firstname + ' ' + contact.lastname}
              className={selectedContacts.includes(contact._id) ? 'selected' : ''}
              onClick={() => handleContactSelection(contact._id)}
            >
              {contact.firstname + ' ' + contact.lastname}
            </option>
          ))}
        </datalist>

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

export default CreateConversationPopup
