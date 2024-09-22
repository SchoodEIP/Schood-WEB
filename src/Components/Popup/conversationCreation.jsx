import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import Select from 'react-select'

const ConversationCreationPopupContent = ({ contacts, createConversation, closeCreateConversationPopup, isAddingParticipants, members = null }) => {
  const [selectedContacts, setSelectedContacts] = useState([])
  const [convTitle, setConvTitle] = useState('')
  const [filteredContacts, setFilteredContacts] = useState(contacts)

  useEffect(() => {
    if (members) {
      const c = contacts.filter(contact =>
        !members.some(member => member._id === contact._id)
      )
      setFilteredContacts(c)
    }
  }, [])
  const handleCreateConversation = () => {
    const ids = []
    selectedContacts.forEach((filteredContacts) => (
      ids.push(filteredContacts._id)
    ))
    if (ids.length === 0) {
      return
    }
    if (isAddingParticipants) {
      createConversation(ids)
    } else {
      const title = convTitle !== '' ? convTitle : 'placeholder title'
      createConversation(title, ids)
    }
    closeCreateConversationPopup()
  }

  const handleSelectChange = (selected) => {
    setSelectedContacts(selected)
  }

  const handleSetConvTitle = (e) => {
    setConvTitle(e.target.value)
  }

  return (
    <>
      <label className='input-label'>
        {isAddingParticipants ? <span className='label-content'>Sélectionner un/des utilisateur(s)</span> : <span className='label-content'>Rechercher un ou plusieurs membre(s) <span style={{ color: 'red' }}>*</span></span>}
        <Select
          isMulti
          data-testid='select-contacts'
          id='select-contacts'
          placeholder='Rechercher un contact'
          options={filteredContacts}
          value={selectedContacts}
          onChange={handleSelectChange}
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => (option.firstname + ' ' + option.lastname)}
        />
      </label>
      {!isAddingParticipants && (
        <label className='input-label' style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
          <span className='label-content'>Donner un nom à la conversation</span>
          <input maxLength='50' style={{ width: '350px' }} type='text' placeholder='Nom de la conversation' value={convTitle} onChange={handleSetConvTitle} />
        </label>
      )}
      <button className='popup-btn' onClick={handleCreateConversation}>
        {isAddingParticipants ? 'Ajouter le membre' : 'Créer la conversation'}
      </button>
      {isAddingParticipants && (
        <div>
          <h3>Membres actuels ({members.length})</h3>
          {members && members.map((member, index) => (
            <p key={index}>{member.firstname} {member.lastname}</p>
          ))}
        </div>
      )}
    </>
  )
}

export default ConversationCreationPopupContent
