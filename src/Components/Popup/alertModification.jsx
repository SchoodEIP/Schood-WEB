import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'
import { toast } from 'react-toastify'
import { disconnect } from '../../functions/disconnect'

const AlertModificationPopupContent = ({ onClose, chosenAlert, handleEditAlert, handleUpdateContent }) => {
  const [editedAlert, setEditedAlert] = useState(chosenAlert)
  const [file, setFile] = useState(null)

  useEffect(() => {
    setEditedAlert(chosenAlert)
  }, [chosenAlert])

  const handleEditChange = (e) => {
    setEditedAlert({ ...editedAlert, [e.target.name]: e.target.value })
  }

  function addFileToAlert (id) {
    const fileData = new FormData()
    fileData.append('file', file)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/${id}`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: fileData
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        handleUpdateContent()
        toast.success('Fichier envoyé avec l\'alerte avec succès')
      })
      .catch((error) => /* istanbul ignore next */ {
        toast.error(`Erreur lors de l'envoi du fichier avec l'alerte ${error.message}`)
      })
  }

  const editAlert = (e) => {
    if (file !== null) { addFileToAlert(chosenAlert.id) }
    handleEditAlert(editedAlert, onClose)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "10px", alignSelf:"center"}}>
      <h3 style={{alignSelf: "center"}}>Modifier l'alerte</h3>
      <label className='input-label'>
        <span className='label-content'>Titre <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='title' placeholder='Titre' value={editedAlert.title} onChange={handleEditChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Message <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='message' placeholder='Message' value={editedAlert.message} onChange={handleEditChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Fichier joint</span>
        <input id='file-input' data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <button style={{alignSelf: "center"}} className='popup-btn' onClick={() => editAlert()}>Modifier l'Alerte</button>
    </div>
  )
}

export default AlertModificationPopupContent
