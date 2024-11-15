import React, { useState } from 'react'
import '../../css/pages/createReports.scss'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import Select from 'react-select';
import { toast } from 'react-toastify';
import cross from '../../assets/Cross.png'

const ReportButton = ({ currentConversation, close }) => {
  const userId = localStorage.getItem('id')
  const userList = currentConversation?.participants
    ? currentConversation.participants
      .filter((participant) => participant._id !== userId)
    : []
  const [reason, setReason] = useState('')
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

  const handleCloseBtn = () => {
    close();
  }

  const handleConfirmClick = async () => {
    try {
      const users = signaledUserId.map(item => item._id)

      toast.loading('Signalement en cours de création...')

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
        toast.dismiss()
        toast.success('Signalement créé avec succès')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error('Erreur lors du signalement de la conversation.')
      }
    } catch (error) {
      toast.error('Erreur lors du signalement de la conversation.')
    }
  }

  return (
    <>
      <div style={{width: '100%'}}>
        <span className='popup-title'>Créer un Signalement</span>
        <button className='close-btn' onClick={handleCloseBtn}><img src={cross} alt='Close' /></button>
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

export default ReportButton
