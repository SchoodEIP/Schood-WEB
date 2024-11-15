import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import Select from 'react-select'

const ConversationCreationPopupContent = ({ contacts, createConversation, closeCreateConversationPopup, setShowLeaveConversationPopup, isAddingParticipants, members = null }) => {
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

  const colourStyles = {
    control: (styles) => (
      { ...styles,
        backgroundColor: 'white',
        height: '45px',
      }
    ),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      fontWeight: '500'
    }),
  };

  return (
    <>
      <label className='input-label'>
        {isAddingParticipants && (
          <div>
            <h3 style={{marginTop: '0px'}}>Membres actuels ({members.length})</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: '10px'}}>
              {members && members.map((member, index) => (
                <p style={{marginTop: '0px', marginBottom: '0px'}} key={index}>{member.firstname} {member.lastname}</p>
              ))}
            </div>
          </div>
        )}
        {isAddingParticipants ? <span style={{marginTop: '10px', fontWeight: '600'}} className='label-content'>Sélectionner un/des utilisateur(s)</span> : <span style={{marginTop: '0px', fontWeight: '600'}} className='label-content'>Rechercher un ou plusieurs membre(s) <span style={{ color: 'red' }}>*</span></span>}
        <Select
          isMulti
          data-testid='select-contacts'
          id='select-contacts'
          placeholder='Rechercher un contact'
          options={filteredContacts}
          value={selectedContacts}
          styles={colourStyles}
          isClearable={false}
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
      <div style={{display: 'flex', flexDirection: 'row', alignContent: 'space-between'}}>
        <button style={{textWrap: 'nowrap'}} disabled={selectedContacts.length <= 0} className='popup-btn' onClick={handleCreateConversation}>
          {isAddingParticipants ? 'Ajouter le membre' : 'Créer la conversation'}
        </button>
        {isAddingParticipants && (
          <button style={{textWrap: 'nowrap'}} className='leave-conversation-btn' onClick={() => setShowLeaveConversationPopup(true)}>
            Quitter la conversation
          </button>
        )}
      </div>
    </>
  )
}

export default ConversationCreationPopupContent
