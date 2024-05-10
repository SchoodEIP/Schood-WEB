import React, { useEffect, useState } from 'react'
import '../../css/pages/createAlerts.scss'
import { disconnect } from '../../functions/sharedFunctions'

const AlertPage = () => {
  const [userRoles, setUserRoles] = useState([])
  const [userClasses, setUserClasses] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState('')
  const [selectedClasses, setSelectedClasses] = useState([])
  const [file, setFile] = useState(null)
  const [isClass, setIsClass] = useState(true)
  const [alertResponse, setAlertResponse] = useState('')
  const [showPopup, setShowPopup] = useState(false)

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
        if (response.status === 403) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => {
        setRole(data.roles[0]._id)
        setUserRoles(data.roles)
      })
      .catch((error) => /* istanbul ignore next */ { setAlertResponse('Erreur lors de la récupération des roles', error.message) })

    // Requête GET : récupération des classes dont l’utilisateur est en charge
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/classes`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 403) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => setUserClasses(data))
      .catch((error) => /* istanbul ignore next */ { setAlertResponse('Erreur lors de la récupération des classes', error.message) })
  }, [])

  const handleAlertSubmit = async (e) => {
    // Requête POST: envoyer l’alerte
    e.preventDefault()
    const data = {
      title,
      message,
      role: !isClass ? role : null,
      classes: isClass ? selectedClasses : []
    }

    function addFileToAlert (id) {
      if (file) {
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
            if (response.status === 403) {
              disconnect();
            }
            setAlertResponse('Fichier envoyé avec l\'alerte avec succès')
          })
          .catch((error) => /* istanbul ignore next */ { setAlertResponse('Erreur lors de l\'envoi du fichier avec l\'alerte', error) })
      }
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.status === 403) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => {
        setAlertResponse('Alerte envoyée avec succès')
        addFileToAlert(data._id)
        setShowPopup(true)
      })
      .catch((error) => /* istanbul ignore next */ {
        setAlertResponse('Erreur lors de l\'envoi de l\'alerte', error)
        setShowPopup(true)
      })
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

  useEffect(() => {
    if (showPopup) {
      resetForm()
    }
  }, [showPopup])

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setSelectedClasses([])
    setIsClass(false)
    setFile(null)
    document.getElementById('file-input').value = ''

    setTimeout(() => {
      setAlertResponse('')
      setShowPopup(false)
    }, 3000)
  }

  return (
    <div className='alert-page'>
      <h1 id='alert-title'>Créer une alerte</h1>

      {
        sessionStorage.getItem('role') === 'teacher'
          ? null
          : (
            <div>
              <button className={!isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Rôles</button>
              <button className={isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Classes</button>
            </div>
            )
      }

      {
        sessionStorage.getItem('role') === 'teacher'
          ? null
          : (
            <div id='roles-container' data-testid='roles-container'>
              <label htmlFor='roles-select'>Type d'utilisateur visé:</label>
              <select className='alert-page-box' data-testid='roles-select' id='roles-select' onChange={(e) => setRole(e.target.value)}>
                {userRoles.map((role, index) => (
                  <option key={index} value={role._id}>{role.name}</option>
                ))}
              </select>
            </div>
            )
      }
      <div id='classes-container' data-testid='classes-container'>
        <label htmlFor='classes-select'>Classes:</label>
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
              <label htmlFor={`class-check-${index}`}>{classe.name}</label>
            </div>
          ))}
        </div>
      </div>

      <label>Titre:</label>
      <input className='alert-page-box' data-testid='alert-title' value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Message:</label>
      <textarea className='alert-page-box' data-testid='alert-message' value={message} onChange={(e) => setMessage(e.target.value)} />

      <label>Fichier joint (optionnel):</label>
      <input id='file-input' className='alert-page-box' data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />

      {showPopup && <div data-testid='popupTest' className='popup' onClick={() => setShowPopup(false)}>{alertResponse}</div>}
      <button className='alert-btn' onClick={handleAlertSubmit}>Envoyer l'alerte</button>
    </div>
  )
}

export default AlertPage
