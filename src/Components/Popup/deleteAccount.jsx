import React from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const DeleteAccountPopupContent = ({ userIdValue, actionType, deleteUserAccount, activateAccount, closeDeleteAccountPopup }) => {
  return (
    <>
      <div>
        <h3>{actionType === 'delete' ? 'Suppression' : actionType === 'suspend' ? 'Suspension' : 'Restauration'} du Compte</h3>
        <p>Êtes-vous sûr(e) de vouloir {actionType === 'delete' ? 'supprimer' : actionType === 'suspend' ? 'suspendre' : 'restaurer'} ce compte ?</p>
        <p>{actionType === 'delete' ? 'Cette action sera irreversible.' : ''}</p>
      </div>
      {
        actionType === 'delete'
          ? <button className='popup-btn' style={{ backgroundColor: 'red', borderColor: 'red' }} onClick={() => deleteUserAccount(true, userIdValue)}>Supprimer</button>
          : actionType === 'suspend'
            ? <button className='popup-text-btn' onClick={() => deleteUserAccount(false, userIdValue)}>Suspendre</button>
            : <button className='popup-text-btn' onClick={() => activateAccount(userIdValue)}>Restaurer</button>
      }
      <button className='popup-btn' onClick={closeDeleteAccountPopup}>Annuler</button>
    </>
  )
}

export default DeleteAccountPopupContent
