import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'

const CategoryCreationPopupContent = () => {
  const [name, setName] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' })

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const openNotification = (message, type) => {
    setNotification({ visible: true, message, type })
    setTimeout(() => {
      setNotification({ visible: false, message: '', type: '' })
    }, 3000) // La notification sera visible pendant 3 secondes
  }

  const fetchCategoryRegister = async () => {
    const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'

    if (name !== '') {
      fetch(categoryRegisterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          name
        })
      }).then(async (response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.ok) {
          setErrMessage('Catégorie créée avec succès.')
          openNotification('Catégorie créée avec succès.', 'success')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          const data = await response.json()
          setErrMessage(data.message)
          openNotification(data.message, 'error')
        }
      })
        .catch((error) => {
          setErrMessage(error.message)
          openNotification(error.message, 'error')
        })
    } else {
      setErrMessage('La catégorie est vide.')
      openNotification('La catégorie est vide.', 'error')
    }
  }

  return (
    <>
      <label className='input-label'>
        <span className='label-content'>Catégorie <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='category' placeholder='Nom' onChange={handleNameChange} />
      </label>
      {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
      {notification.visible &&
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>}
      <button className='popup-btn' onClick={fetchCategoryRegister}>Créer la Catégorie</button>
    </>
  )
}

export default CategoryCreationPopupContent
