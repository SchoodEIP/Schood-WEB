import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const AlertModificationPopupContent = ({ chosenAlert, handleEditAlert, errMessage }) => {
  const [editedAlert, setEditedAlert] = useState(chosenAlert)

  useEffect(() => {
    setEditedAlert(chosenAlert)
  }, [chosenAlert])

  const handleEditChange = (e) => {
    setEditedAlert({ ...editedAlert, [e.target.name]: e.target.value })
  }

  return (
    <>
      <label className='input-label'>
        <span className='label-content'>Titre <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='title' placeholder='Titre' value={editedAlert.title} onChange={handleEditChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Message <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='message' placeholder='Message' value={editedAlert.message} onChange={handleEditChange} />
      </label>
      {/* <label className='input-label'>
        <span className='label-content'>Fichier joint</span>
        <input id='file-input' data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />
      </label> */}
      {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
      <button className='popup-btn' onClick={() => handleEditAlert(editedAlert)}>Modifier l'Alerte</button>
    </>
  )
}

export default AlertModificationPopupContent
