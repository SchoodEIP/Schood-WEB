import React, {useState} from "react"

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

export default CreateConversationPopup;