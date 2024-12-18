import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import Select from 'react-select'
import userIcon from '../../assets/userIcon.png'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const SingleAccountCreationPopupContent = ({ handleUpdateContent }) => {
  const roleProfile = sessionStorage.getItem('role')
  const singleCreationUrl = process.env.REACT_APP_BACKEND_URL + '/adm/register'
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [rolesList, setRolesList] = useState([])
  const [role, setRole] = useState('')
  const [classes, setClasses] = useState([])
  const [classesList, setClassesList] = useState([])
  const [titlesList, setTitlesList] = useState([])
  const [isMultiStatus, setIsMultiStatus] = useState(true)
  const [picture, setPicture] = useState(null)
  const [title, setTitle] = useState(null)

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
    if (event.target.value === rolesList.filter((role) => role.name === 'student')[0]._id) {
      setIsMultiStatus(false)
    } else {
      setIsMultiStatus(true)
    }
  }

  const handleClasseChange = (selected) => {
    if (role === rolesList.filter((role) => role.name === 'student')[0]._id) {
      setClasses([selected])
    } else {
      setClasses(selected)
    }
  }

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0])
  }

  const validateEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi
    return regEx.test(email)
  }

  async function modifyAccount (updatedUser, userId) {
    const formData = new FormData()
    formData.append('firstname', updatedUser.firstname)
    formData.append('lastname', updatedUser.lastname)
    formData.append('role', updatedUser.role)
    formData.append('email', updatedUser.email)

    if (picture) {
      formData.append('file', picture)
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/modifyProfile/${userId}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: formData
    })

    if (response.status === 401) {
      disconnect()
    } else if (response.ok) {
      toast.success('Compte créé avec succès')
      handleUpdateContent()
    } else {
      toast.error('Erreur lors de la mise à jour du profil: ' + response.statusText)
    }
  }

  const singleAccountCreation = async (event) => {
    event.preventDefault()

    const filteredArray = rolesList.filter((item) => item.levelOfAccess === 2)
    const roleId = filteredArray.map((item) => item._id)

    let classesArray = []
    if (classes.length !== 0 && role === rolesList.filter((role) => role.name === 'student')[0]._id) {
      classesArray.push(classes)
    } else {
      classesArray = classes
    }

    if (firstname === '') {
      toast.error('Il manque le prénom.')
      return
    } else if (lastname === '') {
      toast.error('Il manque le nom de famille.')
      return
    } else if (email === '') {
      toast.error("Il manque l'adresse email.")
      return
    } else if (!validateEmail(email)) {
      toast.error("L'adresse email n'est pas valide.")
      return
    } else if (roleProfile !== 'admin' && picture === '') {
      toast.error('Veuillez fournir une image de profil')
      return
    } else if (roleProfile !== 'admin' && classesArray.length === 0) {
      if (role.name === 'teacher') {
        toast.error('Veuillez assigner une ou plusieurs classes à cet enseignant.')
      } else {
        toast.error('Veuillez assigner une classe à cet étudiant.')
      }
      return
    }

    const adminPayload = {
      firstname,
      lastname,
      email,
      role: roleId[0],
      classes: []
    }

    const schoolAdminPayload = {
      firstname,
      lastname,
      email,
      role,
      classes: classesArray,
      picture: userIcon
    }

    await fetch(singleCreationUrl, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roleProfile === 'admin' ? adminPayload : schoolAdminPayload)
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        } else if (response.ok) {
          if (!picture) {
            toast.success('Compte créé avec succès')
            handleUpdateContent()
          } else {
            return response.json()
          }
          // window.location.reload()
        } else {
          return response.json()
        }
      })
      .then((data) => {
        if (data) {
          if (picture) {
            modifyAccount(schoolAdminPayload, data.id)
          } else {
            toast.error(data.message)
          }
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/shared/roles', {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setRolesList(data.roles)
        setRole(data.roles.filter((user) => user.name === 'teacher')[0]._id)
      })
      .catch((error) => {
        toast.error(error.message)
      })

    fetch(process.env.REACT_APP_BACKEND_URL + '/shared/classes', {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => setClassesList(data))
      .catch((error) => {
        toast.error(error.message)
      })

    fetch(process.env.REACT_APP_BACKEND_URL + '/shared/titles', {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setTitlesList(data)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [])

  return (
    <div>
      {/* Le reste du contenu du composant */}
      {roleProfile === 'admin'
        ? (
            ''
          )
        : (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <img style={{ width: '50px', borderRadius: '50%' }} src={picture || userIcon} alt='photo de profil' />
            <label className='input-label'>
              <span className='label-content'>Changer la photo de Profil</span>
              <input className='picture-input' name='picture' placeholder='Changer la photo' onChange={handlePictureChange} type='file' accept='.png, .jpeg, .jpg' />
            </label>
          </div>
          )}
      {roleProfile === 'admin'
        ? (
            ''
          )
        : (
          <label className='input-label'>
            <span className='label-content'>Rôle <span style={{ color: 'red' }}>*</span></span>
            {rolesList[0] !== undefined
              ? (
                <select defaultValue={role} name='role' placeholder='Rôle' onChange={handleRoleChange}>
                  <option value={rolesList.filter((role) => role.name === 'teacher')[0]._id}>{rolesList.filter((role) => role.name === 'teacher')[0].frenchName}</option>
                  <option value={rolesList.filter((role) => role.name === 'student')[0]._id}>{rolesList.filter((role) => role.name === 'student')[0].frenchName}</option>
                </select>
                )
              : (
                  ''
                )}
            {rolesList[0] !== undefined && role === rolesList.filter((role) => role.name === 'teacher')[0]._id && titlesList !== undefined
              ? (
                <label className='input-label'>
                  <span className='label-content'>Titre <span style={{ color: 'red' }}>*</span></span>
                  <select data-testid='title-select' defaultValue={title} name='title' placeholder='Titre' onChange={handleTitleChange}>
                    {titlesList.map((title, index) => {
                      return <option key={index} value={title._id}>{title.name}</option>
                    })}
                  </select>
                </label>
                )
              : (
                  ''
                )}
            <label className='input-label'>
              <span className='label-content'>Classe(s) <span style={{ color: 'red' }}>*</span></span>
              <Select
                isMulti={isMultiStatus}
                data-testid='select-classes'
                id='select-classes'
                placeholder='Sélectionner une ou plusieurs classes'
                options={classesList}
                value={classes}
                onChange={handleClasseChange}
                getOptionValue={(option) => option._id}
                getOptionLabel={(option) => option.name}
              />
            </label>
          </label>
          )}
      <div>
        <label className='input-label' style={{ gap: '10px' }}>
          <span className='label-content'>Prénom <span style={{ color: 'red' }}>*</span></span>
          <input style={{ width: '350px' }} placeholder='Prénom' value={firstname} onChange={handleFirstNameChange} type='text' />
        </label>
        <label className='input-label' style={{ gap: '10px' }}>
          <span className='label-content'>Nom <span style={{ color: 'red' }}>*</span></span>
          <input style={{ width: '350px' }} placeholder='Nom' value={lastname} onChange={handleLastNameChange} type='text' />
        </label>
        <label className='input-label' style={{ gap: '10px' }}>
          <span className='label-content'>Adresse Email <span style={{ color: 'red' }}>*</span></span>
          <input style={{ width: '350px' }} placeholder='Email' value={email} onChange={handleEmailChange} type='text' />
        </label>
      </div>
      <button className='popup-btn' onClick={singleAccountCreation}>Créer le Compte</button>
    </div>
  )
}

export default SingleAccountCreationPopupContent
