import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createReports.scss'
import { disconnect } from '../../functions/disconnect'
import Select from 'react-select'
import { toast } from 'react-toastify';

const ReportCreationPopupContent = () => {
  const userId = localStorage.getItem('id')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [signaledUserId, setSignaledUserId] = useState([''])
  const [userList, setUserList] = useState([])

  const colourStyles = {
    control: (styles) => (
      { ...styles,
        backgroundColor: 'white',
        height: '45px',
      }
    ),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      fontWeight: '500'
    }),
  };

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
      .catch(error => toast.error('Erreur lors de la récupération de la liste des utilisateurs', error.message))
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
    toast.loading('Signalement en cours de création...')
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
        toast.dismiss()
        toast.success('Signalement créé avec succès')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error('Erreur lors du signalement de la conversation.')
      }
    } catch (error) /* istanbul ignore next */ {
      toast.error('Erreur lors du signalement de la conversation.')
    }
  }

  return (
    <>
      <div style={{width: '100%'}}>
        <span className='popup-title'>Créer un Signalement</span>
      </div>
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
        <Select
          isMulti
          data-testid='user-select'
          id='user-select'
          placeholder='Sélectionnez un des membres de la conversation'
          options={userList}
          value={signaledUserId}
          isClearable={false}
          onChange={handleSignaledUserIdChange}
          styles={colourStyles}
          getOptionValue={(option) => (option._id)}
          getOptionLabel={(option) => (option.firstname + ' ' + option.lastname)}
        />
      </label>
      <label className='input-label' style={{width: '100%'}}>
        <span className='label-content'>Description</span>
        <textarea style={{height: '100px', resize: 'none'}} value={message} onChange={handleMessageChange} placeholder='Veuillez expliquer la raison de votre signalement ici.' />
      </label>
      <button disabled={reason === '' || signaledUserId.length <= 0} onClick={handleConfirmClick} className='popup-btn'>Confirmer le signalement</button>
    </>
  )
}

export default ReportCreationPopupContent
