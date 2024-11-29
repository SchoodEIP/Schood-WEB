import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const CategoryCreationPopupContent = ({ onClose }) => {
  const [name, setName] = useState('')

  const handleNameChange = (event) => {
    setName(event.target.value)
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
          toast.success('Catégorie créée avec succès.')
        } else {
          const data = await response.json()
          toast.error(data.message)
        }
      })
        .catch((error) => {
          toast.error(error.message)
        })
    } else {
      toast.error('La catégorie est vide.')
    }
  }

  return (
    <>
      <label className='input-label'>
        <span className='label-content'>Catégorie <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='category' placeholder='Nom' onChange={handleNameChange} />
      </label>
      <button className='popup-btn' onClick={fetchCategoryRegister}>Créer la Catégorie</button>
    </>
  )
}

export default CategoryCreationPopupContent
