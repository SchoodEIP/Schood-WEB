import React, { useState } from 'react'
import Select from 'react-select';

const CreateConversationPopup = ({
  contacts,
  createConversation,
  closeCreateConversationPopup,
  isPopupOpen
}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [convTitle, setConvTitle] = useState('')

  const handleCreateConversation = () => {
    const ids = []
    selectedContacts.map((contact) => (
      ids.push(contact._id)
    ))
    if (ids.length === 0) {
      return
    }
    const title = convTitle !== '' ? convTitle : "placeholder title"
    createConversation(title, ids)
    closeCreateConversationPopup()
  }

  const handleSelectChange = (selected) => {
    setSelectedContacts(selected);
  };

  const handleSetConvTitle = (e) => {
    setConvTitle(e.target.value);
  };

  return (
    <div>
      <div className='popup-content'>
        <h2>Nouvelle conversation</h2>
        <div>
          <label>Rechercher un contact:</label>
          <Select
            isMulti
            id="select-contacts"
            options={contacts}
            value={selectedContacts}
            onChange={handleSelectChange}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => (option.firstname + " " + option.lastname)}
          />
        </div>
        <div>
          <label>
            Donner un nom à la conversation:
          </label>
          <input type="text" placeholder="nom de la conversation" value={convTitle} onChange={handleSetConvTitle}/>
        </div>
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
