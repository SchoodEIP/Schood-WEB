import React from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const DeleteAccountPopupContent = ({ user_id, deleteUserAccount, closeDeleteAccountPopup }) => {
  return (
    <>
      <div>
        <h3>Supprimer Définitivement le Compte</h3>
        <p>Êtes-vous sûr(e) de vouloir supprimer ce compte définitivement ?</p>
        <p>Cette action sera irreversible.</p>
      </div>
      <button className='popup-btn' onClick={() => deleteUserAccount(true, user_id)}>Supprimer Définitivement</button>
      <button className='popup-btn' onClick={closeDeleteAccountPopup}>Annuler</button>
    </>
  )
}

export default DeleteAccountPopupContent
