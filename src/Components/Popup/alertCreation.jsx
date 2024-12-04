import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'
import { disconnect } from '../../functions/disconnect'

const AlertCreationPopupContent = () => {
  const roleProfile = sessionStorage.getItem('role')
  const [userRoles, setUserRoles] = useState([])
  const [userClasses, setUserClasses] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState('')
  const [selectedClasses, setSelectedClasses] = useState([])
  const [file, setFile] = useState(null)
  const [isClass, setIsClass] = useState(true)

  useEffect(() => {
    // Requête GET : récupération de la liste des types d’utilisateurs
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/roles`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setRole(data.roles[0]._id)
        setUserRoles(data.roles)
      })
      .catch((error) => /* istanbul ignore next */ { toast.error('Erreur lors de la récupération des roles', error.message) })

    // Requête GET : récupération des classes dont l’utilisateur est en charge
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/classes`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => (data.message === 'Access Forbidden' ? setUserClasses([]) : setUserClasses(data)))
      .catch((error) => /* istanbul ignore next */ { toast.error('Erreur lors de la récupération des classes', error.message) })
  }, [])

  const handleAlertSubmit = async (e) => {
    e.preventDefault()

    const data = {
      title,
      message,
      role,
      classes: []
    }

    const classData = {
      title,
      message,
      classes: selectedClasses
    }

    if (title === '') {
      toast.error('Le titre est vide.')
      return
    } else if (message === '') {
      toast.error('Le message est vide.')
      return
    } else if (isClass && selectedClasses.length === 0) {
      toast.error("Aucune classe n'a été sélectionnée.")
      return
    } else if (!isClass && role === '') {
      toast.error("Aucun rôle n'a été sélectionné.")
      return
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(!isClass ? data : classData)
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        toast.success('Alerte envoyée avec succès')
        if (file) {
          addFileToAlert(data._id)
        } else {
          window.location.reload()
        }
      })
      .catch((error) => /* istanbul ignore next */ {
        toast.error('Erreur lors de l\'envoi de l\'alerte', error)
      })

    function addFileToAlert (id) {
      const fileData = new FormData()
      fileData.append('file', file)

      fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/${id}`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: fileData
      })
        .then(response => {
          if (response.status === 401) {
            disconnect()
          }
          toast.success('Fichier envoyé avec l\'alerte avec succès')
          window.location.reload()
        })
        .catch((error) => /* istanbul ignore next */ { toast.error('Erreur lors de l\'envoi du fichier avec l\'alerte', error) })
    }
  }

  const handleAlertType = () => {
    const rolesContainer = document.getElementById('roles-container')
    const classesContainer = document.getElementById('classes-container')
    if (isClass) {
      classesContainer.style.display = 'none'
      rolesContainer.style.display = 'flex'
      setIsClass(false)
    } else {
      classesContainer.style.display = 'flex'
      rolesContainer.style.display = 'none'
      setIsClass(true)
    }
  }

  return (
    <>
      {
            roleProfile === 'teacher'
              ? null
              : (
                <div id='interaction-btn-container'>
                  <button className={!isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Utilisateurs Visés</button>
                  <button className={!isClass ? '' : 'no-interaction-btn'} onClick={handleAlertType}>Classe(s) visée(s)</button>
                </div>
                )
            }
      {
            roleProfile === 'teacher'
              ? null
              : (
                <label id='roles-container' className='input-label'>
                  <span className='label-content'>Type d'utilisateur visé:</span>
                  <select data-testid='roles-select' id='roles-select' onChange={(e) => setRole(e.target.value)}>
                    {userRoles.map((role, index) => (
                      <option key={index} value={role._id}>{role.frenchName}</option>
                    ))}
                  </select>
                </label>
                )
            }
      <div id='classes-container' data-testid='classes-container'>
        <label className='input-label' htmlFor='classes-select'>
          <span className='label-content'>Classes:</span>
          <div id='classes-select' className='checkbox-list'>
            {userClasses.map((classe, index) => (
              <div key={index} className='checkbox-item'>
                <input
                  className='alert-page-box'
                  type='checkbox'
                  id={`class-check-${index}`}
                  data-testid={`class-check-${index}`}
                  value={classe._id}
                  checked={selectedClasses.includes(classe._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClasses([...selectedClasses, classe._id])
                    } else {
                      setSelectedClasses(selectedClasses.filter((id) => id !== classe._id))
                    }
                  }}
                />
                <label className='input-label' htmlFor={`class-check-${index}`}><span className='label-content'>{classe.name}</span></label>
              </div>
            ))}
          </div>
        </label>
      </div>
      <label className='input-label'>
        <span className='label-content'>Titre <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='title' placeholder='Titre' value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Message <span style={{ color: 'red' }}>*</span></span>
        <input type='text' name='message' placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <label className='input-label'>
        <span className='label-content'>Fichier joint</span>
        <input style={{ fontFamily: 'Inter' }} id='file-input' data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <button className='popup-btn' onClick={handleAlertSubmit}>Créer l'Alerte</button>
    </>
  )
}

export default AlertCreationPopupContent
