import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const HelpNumberCreationPopupContent = ({ handleUpdateContent, onClose }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [telephone, setTelephone] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleTelephoneChange = (event) => {
    setTelephone(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategoryID(event.target.value)
  }

  useEffect(() => {
    const fetchUpdatedCategories = async () => {
      const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
      const response = await fetch(categoryUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 401) {
        disconnect()
      }
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        setCategoryID(data.length > 0 ? data[0]._id : '')
      } else {
        toast.error('Erreur lors de la récupération des catégories.')
      }
    }

    fetchUpdatedCategories()
  }, [])

  const validateEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi

    return regEx.test(email)
  }

  const fetchHelpNumberRegister = async () => {
    const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'

    let sendPost = true

    if (name === '') {
      toast.error('Le nom est vide.')
      sendPost = false
    } else if (!/^[0-9]+$/.test(telephone) || telephone === '') {
      toast.error('Veuillez fournir un numéro de téléphone valide.')
      sendPost = false
    } else if (email === '' || !validateEmail(email)) {
      toast.error('Veuillez fournir une adresse email valide.')
      sendPost = false
    } else if (description === '') {
      toast.error("Veuillez fournir une description de ce numéro d'aide.")
      sendPost = false
    }

    if (sendPost) {
      fetch(helpNumberRegisterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          email,
          name,
          telephone,
          helpNumbersCategory: categoryID,
          description
        })
      }).then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.ok) {
          toast.success("Numéro d'aide ajouté avec succès.")
          handleUpdateContent()
        } else /* istanbul ignore next */ {
          const data = response.json()
          toast.error(data.message)
        }
      })
        .catch((error) => /* istanbul ignore next */ { toast.error(error.message) })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', alignSelf: 'center' }}>
      <h3>Création d'un nouveau numéro d'aide</h3>
      <label className='input-label'>
        <span className='label-content'>Catégorie <span style={{ color: 'red' }}>*</span></span>
        <select data-testid='category-select' value={categoryID} onChange={handleCategoryChange}>
          {categories.map((option, index) => (
            <option key={index} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      </label>
      <label className='input-label'>
        <span className='label-content'>Nom <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='category' placeholder='Nom' onChange={handleNameChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Numéro de Téléphone <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='telephone' placeholder='0000000000' onChange={handleTelephoneChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Adresse Email <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='email' placeholder='prenom.nom.Schood1@schood.fr' onChange={handleEmailChange} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Description <span style={{ color: 'red' }}>*</span></span>
        <textarea name='description' placeholder="Une description à propos de l'aide fournie" onChange={handleDescriptionChange} />
      </label>
      <button className='popup-btn' onClick={fetchHelpNumberRegister}>Créer le Numéro</button>
    </div>
  )
}

export default HelpNumberCreationPopupContent
