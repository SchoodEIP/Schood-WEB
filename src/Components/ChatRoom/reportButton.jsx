import React, { useState } from 'react'
import '../../css/pages/createAlerts.scss'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import Select from 'react-select'

const ReportButton = ({ currentConversation }) => {
  const userId = localStorage.getItem('id')
  const userList = currentConversation?.participants
    ? currentConversation.participants
      .filter((participant) => participant._id !== userId)
    : []
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [signaledUserId, setSignaledUserId] = useState([''])

  const handleReasonChange = (e) => {
    setReason(e.target.value)
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSignaledUserIdChange = (e) => {
    setSignaledUserId(e)
  }

  const handleConfirmClick = async () => {
    try {
      const users = signaledUserId.map(item => item._id)

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usersSignaled: users,
          message,
          conversation: currentConversation._id,
          type: reason
        })
      })

      if (response.status === 401) {
        disconnect()
      }

      if (response.status === 200) {
        setError('Signalement en cours de traitement')
        window.location.reload()
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
        <span className='label-content'>Raison <span style={{ color: 'red' }}>*</span></span>
        <select value={reason} onChange={handleReasonChange}>
          <option value=''>Sélectionnez une raison</option>
          <option value='bullying'>Harcèlement</option>
          <option value='badcomportment'>Contenu offensant</option>
          <option value='spam'>Spam</option>
          <option value='other'>Autre</option>
        </select>
      </label>
      <label className='input-label'>
        <span className='label-content'>Utilisateur/Utilisatrice signalé(e) <span style={{ color: 'red' }}>*</span></span>
        {/* <select value={signaledUserId} onChange={handleSignaledUserIdChange}>
          <option value=''>Sélectionnez un des membres de la conversation</option> */}
          <Select
            isMulti
            data-testid='user-select'
            id='user-select'
            placeholder='Sélectionnez un des membres de la conversation'
            options={userList}
            value={signaledUserId}
            onChange={handleSignaledUserIdChange}
            getOptionValue={(option) => (option._id)}
            getOptionLabel={(option) => (option.firstname + ' ' + option.lastname)}
          />
          {/* {
            userList.map((user, index) => {
              return <option key={index} value={user._id}>{user.firstname} {user.lastname}</option>
            })
          } */}
        {/* </select> */}
      </label>
      <label className='input-label'>
        <span className='label-content'>Description</span>
        <textarea value={message} onChange={handleMessageChange} placeholder='Veuillez expliquer votre raison ici.' />
      </label>
      {error && <div className='error-message'>{error}</div>}
      <button onClick={handleConfirmClick} className='popup-btn'>Confirmer le signalement</button>
    </>
  )
}

export default ReportButton
