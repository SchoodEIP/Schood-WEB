import React, { useState } from 'react'

const CreateConversationPopup = ({
  contacts,
  createConversation,
  closeCreateConversationPopup,
  isPopupOpen
}) => {
  const [searchInput, setSearchInput] = useState('')
  const [searchId, setSearchId] = useState('')
  const [filteredContacts, setFilteredContacts] = useState(contacts)

  const handleSearchInputChange = (e) => {
    const inputValue = e.target.value
    const contact = contacts.find(item => item._id === inputValue)
    if (contact) {
      setSearchInput(contact.firstname + ' ' + contact.lastname)
      setSearchId(e.target.value)
    } else {
      const filteredList = contacts.filter(
        (contact) =>
          contact.firstname.toLowerCase().includes(inputValue.toLowerCase()) ||
          contact.lastname.toLowerCase().includes(inputValue.toLowerCase())
      );

      setFilteredContacts(filteredList);
      setSearchId('')
      setSearchInput(e.target.value)
    }
    if (inputValue) {
      setFilteredContacts(contacts)
    }
  }

  const handleCreateConversation = () => {
    const newConversationName = searchId.trim()
    if (newConversationName === '') {
      return
    }
    createConversation(newConversationName, [searchId])
    closeCreateConversationPopup()
  }

  return (
    <div>
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
          {filteredContacts.map((contact) => (
            <option key={contact._id} value={contact._id}>
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
