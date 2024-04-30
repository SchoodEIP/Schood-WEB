import React, { useState } from 'react'
import '../../css/pages/createAlerts.scss'
const ReportButton = ({ currentConversation }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [signaledUsersId, setSignaledUsersId] = useState(currentConversation?.participants ? currentConversation.participants.filter((participant) => participant.id !== localStorage.getItem('id')).map((participant) => participant._id) : [])

  const handleReportClick = () => {
    setShowConfirmation(true)
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value)
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
          usersSignaled: signaledUsersId,
          message: '',
          conversation: currentConversation._id,
          type: reason
        })
      })

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
    <div>
      <select value={reason} onChange={handleReasonChange} className='select-reason'>
        <option value=''>Sélectionnez une raison</option>
        <option value='bullying'>Harcèlement</option>
        <option value='badcomportment'>Contenu offensant</option>
        <option value='spam'>Spam</option>
        <option value='other'>Autre</option>
      </select>
      <button onClick={handleConfirmClick} className='alert-btn confirm'>Confirmer le signalement</button>
      {error && <div className='error-message'>{error}</div>}
    </div>
  )
}

export default ReportButton
