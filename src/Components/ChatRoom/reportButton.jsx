import React, { useState } from 'react'

const ReportButton = ({ currentConversation }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleReportClick = () => {
    setShowConfirmation(true)
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value)
  }

  const handleConfirmClick = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/report`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: currentConversation._id,
          reason
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
      <button onClick={handleReportClick} className='button signal'>Signaler</button>
      {showConfirmation && (
        <div>
          <select value={reason} onChange={handleReasonChange} className='select-reason'>
            <option value=''>Sélectionnez une raison</option>
            <option value='Contenu offensant'>Contenu offensant</option>
            <option value='Spam'>Spam</option>
            <option value='Autre'>Autre</option>
          </select>
          <button onClick={handleConfirmClick} className='button confirm'>Confirmer le signalement</button>
          {error && <div className='error-message'>{error}</div>}
        </div>
      )}
    </div>
  )
}

export default ReportButton
