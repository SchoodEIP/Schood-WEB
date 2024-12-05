import React from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const AlertDeletionPopupContent = ({ onClose, chosenAlert, handleDeleteAlert }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignSelf: 'center' }}>
      <h3 style={{ alignSelf: 'center' }}>Supprimer l'alerte</h3>
      <p>Êtes-vous certain(e) de vouloir supprimer cette alerte ?</p>
      <p>Cette action sera irréversible.</p>
      <button style={{ alignSelf: 'center' }} className='popup-btn' onClick={() => handleDeleteAlert(chosenAlert.id, onClose)}>Supprimer l'Alerte</button>
    </div>
  )
}

export default AlertDeletionPopupContent
