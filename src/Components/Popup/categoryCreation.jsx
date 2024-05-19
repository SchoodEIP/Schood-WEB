import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'

const CategoryCreationPopupContent = () => {
    const [name, setName] = useState('')
    const [errMessage, setErrMessage] = useState('')


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
            }).then((response) => {
              if (response.status === 401) {
                disconnect();
              }
              if (response.ok) {
                setErrMessage('Catégorie créée avec succès.')
                window.location.reload()
              } else /* istanbul ignore next */ {
                const data = response.json()
                setErrMessage(data.message)
              }
            })
              .catch((error) => /* istanbul ignore next */ { setErrMessage(error.message) })
        } else {
            setErrMessage('La catégorie est vide.')
        }
      }

    return (
        <>
            <label className='input-label'>
                <span className='label-content'>Catégorie <span style={{ color: 'red' }}>*</span></span>
                <input type='text' name='category' placeholder='Nom' onChange={handleNameChange} />
            </label>
            {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
            <button className='popup-btn' onClick={fetchCategoryRegister}>Créer la Catégorie</button>
        </>
    )
}

export default CategoryCreationPopupContent