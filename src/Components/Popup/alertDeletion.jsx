import React from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const AlertDeletionPopupContent = ({ onClose, chosenAlert, handleDeleteAlert }) => {
  return (
    <>
      <p>Êtes-vous certain(e) de vouloir supprimer cette alerte ?</p>
      <p>Cette action sera irréversible.</p>
      <button className='popup-btn' onClick={() => handleDeleteAlert(chosenAlert.id, onClose)}>Supprimer l'Alerte</button>
    </>
  )
}

export default AlertDeletionPopupContent
