import React from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const DeleteAccountPopupContent = ({ user_id, deleteUserAccount, closeDeleteAccountPopup }) => {
  return (
    <>
      <div>
        <h3>Suppression du Compte</h3>
        <p>Êtes-vous sûr(e) de vouloir supprimer ce compte ?</p>
        <p>Une suppression temporaire dure 7 jours.</p>
        <p>Cette action sera irreversible.</p>
      </div>
      <button className='popup-btn' style={{ backgroundColor: 'red', borderColor: 'red' }} onClick={() => deleteUserAccount(true, user_id)}>Suppression définitive</button>
      <button className='popup-text-btn' onClick={() => deleteUserAccount(false, user_id)}>Suppression temporaire</button>
      <button className='popup-btn' onClick={closeDeleteAccountPopup}>Annuler</button>
    </>
  )
}

export default DeleteAccountPopupContent
