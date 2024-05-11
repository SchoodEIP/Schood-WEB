import React, { useState } from 'react'
import '../../css/pages/createAlerts.scss'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/sharedFunctions'

const ReportButton = ({ currentConversation }) => {
  const signaledUsersId = currentConversation?.participants ? currentConversation.participants.filter((participant) => participant.id !== localStorage.getItem('id')).map((participant) => participant._id) : []
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleReportClick = () => {
    setShowConfirmation(true)
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value)
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleConfirmClick = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userSignaled: signaledUsersId[0],
          message: message,
          conversation: currentConversation._id,
          type: reason
        })
      })

      if (response.status === 401) {
        disconnect();
      }

      if (response.status === 200) {
        setShowConfirmation(false)
        setReason('')
      } else {
        setError('Erreur lors du signalement de la conversation.')
      }
    } catch (error) {
      setError('Erreur lors du signalement de la conversation.')
    }
  }

  return (
    <>
      <label className='input-label'>
        <span className='label-content'>Raison:</span>
        <select value={reason} onChange={handleReasonChange}>
          <option value=''>Sélectionnez une raison</option>
          <option value='bullying'>Harcèlement</option>
          <option value='badcomportment'>Contenu offensant</option>
          <option value='spam'>Spam</option>
          <option value='other'>Autre</option>
        </select>
      </label>
      <label className='input-label'>
        <span className='label-content'>Description <span style={{ color: 'red' }}>*</span></span>
        <textarea value={message} onChange={handleMessageChange} placeholder='Veuillez expliquer votre raison ici.'></textarea>
      </label>
      {error && <div className='error-message'>{error}</div>}
      <button onClick={handleConfirmClick} className='popup-btn'>Confirmer le signalement</button>
    </>
  )
}

export default ReportButton
