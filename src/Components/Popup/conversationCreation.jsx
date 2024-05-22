import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import Select from 'react-select'

const ConversationCreationPopupContent = ({ contacts, createConversation, closeCreateConversationPopup }) => {
  const [selectedContacts, setSelectedContacts] = useState([])
  const [convTitle, setConvTitle] = useState('')

  const handleCreateConversation = () => {
    const ids = []
    selectedContacts.forEach((contact) => (
      ids.push(contact._id)
    ))
    if (ids.length === 0) {
      return
    }
    const title = convTitle !== '' ? convTitle : 'placeholder title'
    createConversation(title, ids)
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
        <span className='label-content'>Rechercher un ou plusieurs contact(s) <span style={{ color: 'red' }}>*</span></span>
        <Select
          isMulti
          data-testid='select-contacts'
          id='select-contacts'
          placeholder='Rechercher un contact'
          options={contacts}
          value={selectedContacts}
          onChange={handleSelectChange}
          getOptionValue={(option) => option._id}
          getOptionLabel={(option) => (option.firstname + ' ' + option.lastname)}
        />
      </label>
      <label className='input-label' style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
        <span className='label-content'>Donner un nom à la conversation</span>
        <input maxlength='50' style={{ width: '350px' }} type='text' placeholder='Nom de la conversation' value={convTitle} onChange={handleSetConvTitle} />
      </label>
      <button className='popup-btn' onClick={handleCreateConversation}>
        Créer la conversation
      </button>
    </>
  )
}

export default ConversationCreationPopupContent
