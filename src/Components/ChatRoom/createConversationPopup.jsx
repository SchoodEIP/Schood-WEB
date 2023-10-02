import React, { useState } from 'react'

const CreateConversationPopup = ({
  contacts,
  createConversation,
  closeCreateConversationPopup
}) => {
  const [searchInput, setSearchInput] = useState('')

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleCreateConversation = () => {
    const newConversationName = searchInput.trim()
    if (newConversationName === '') {
      return
    }
    const contactId = document.getElementById('contact-input').value
    createConversation(newConversationName, [contactId])
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
              value={contact._id}
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
