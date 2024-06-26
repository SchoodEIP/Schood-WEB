import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import Select from 'react-select'

const ReportCreationPopupContent = () => {
  const userId = localStorage.getItem('id')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [signaledUserId, setSignaledUserId] = useState([''])
  const [userList, setUserList] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/users`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        disconnect()
      }
      return response.json()
    })
      .then(data => {
        const filteredList = data.filter((user) => user._id !== userId)
        setUserList(filteredList)
      })
      .catch(error => setError('Erreur lors de la récupération de la liste des utilisateurs', error.message))
  }, [])

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
    const users = signaledUserId.map(item => item._id)
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usersSignaled: users,
          message,
          conversation: null,
          type: reason
        })
      })

      if (response.status === 401) {
        disconnect()
      } else if (response.status === 200) {
        setError('Signalement en cours de traitement')
        window.location.reload()
      } else {
        setError('Erreur lors du signalement de la conversation.')
      }
    } catch (error) /* istanbul ignore next */ {
      setError('Erreur lors du signalement de la conversation.')
    }
  }

  return (
    <>
      <label className='input-label'>
        <span className='label-content'>Raison <span style={{ color: 'red' }}>*</span></span>
        <select data-testid='reason-select' value={reason} onChange={handleReasonChange}>
          <option value=''>Sélectionnez une raison</option>
          <option value='bullying'>Harcèlement</option>
          <option value='badcomportment'>Contenu offensant</option>
          <option value='spam'>Spam</option>
          <option value='other'>Autre</option>
        </select>
      </label>
      <label className='input-label'>
        <span className='label-content'>Utilisateur/Utilisatrice signalé(e) <span style={{ color: 'red' }}>*</span></span>
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

export default ReportCreationPopupContent
