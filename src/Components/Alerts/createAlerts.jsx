import React, { useEffect, useState } from 'react'
import '../../css/pages/createAlerts.scss'

const AlertPage = () => {
  const [userRoles, setUserRoles] = useState([])
  const [userClasses, setUserClasses] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState('')
  const [selectedClasses, setSelectedClasses] = useState([])
  const [file, setFile] = useState({})
  const [questionnaires, setQuestionnaires] = useState([])
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('')
  const userRole = localStorage.getItem('role')
  const [isClass, setIsClass] = useState(false)
  const [positiveResponse, setPositiveResponse] = useState('')
  const [negativeResponse, setNegativeResponse] = useState('')

  useEffect(() => {
    // Requête GET : récupération de la liste des types d’utilisateurs
    fetch(`${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data) => {
        setRole(data.roles[0]._id)
        setUserRoles(data.roles)
      })
      .catch(error => setNegativeResponse('Erreur lors de la récupération des roles', error.message))

    // Requête GET : récupération des classes dont l’utilisateur est en charge
    fetch(`${process.env.REACT_APP_BACKEND_URL}/adm/classes`, {
      method: "GET",
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data) => setUserClasses(data))
      .catch(error => setNegativeResponse('Erreur lors de la récupération des classes', error.message))

    // Requête GET : liste des questionnaires à venir et en cours
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`, {
      method: "GET",
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setQuestionnaires(response.data)
      })
      .catch(error => setNegativeResponse('Erreur lors de la récupération des questionnaires', error.message))
  }, [])

  const handleAlertSubmit = () => {
    // Requête POST: envoyer l’alerte
    const data = {
      title,
      message,
      role: !isClass ? role : null,
      classes: isClass ? selectedClasses : []
    }

    const fileData = new FormData()
    fileData.append('file', file)
    setNegativeResponse('')

    function addFileToAlert (id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/${id}`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: fileData
      })
        .then(response => {
          setPositiveResponse('Fichier envoyé avec l\'alerte avec succès')
        })
        .catch(error => setNegativeResponse('Erreur lors de l\'envoi du fichier avec l\'alerte', error))
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then((data) => {
        setPositiveResponse('Alerte envoyée avec succès')
        if (file) {
          addFileToAlert(data._id)
        }
      })
      .catch(error => setNegativeResponse('Erreur lors de l\'envoi de l\'alerte', error))
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
    <div className='alert-page'>
      <h1>Créer une alerte</h1>

      <div>
        <button className={!isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Rôles</button>
        <button className={isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Classes</button>
      </div>
      <div id='roles-container' data-testid='roles-container'>
        <label htmlFor='roles-select'>Type d'utilisateur visé:</label>
        <select data-testid='roles-select' id='roles-select' onChange={(e) => setRole(e.target.value)}>
          {userRoles.map((role, index) => (
            <option key={index} value={role._id}>{role.name}</option>
          ))}
        </select>
      </div>

      <div id='classes-container' data-testid='classes-container'>
        <label htmlFor='classes-select'>Classes:</label>
        <div id='classes-select' className='checkbox-list'>
          {userClasses.map((classe, index) => (
            <div key={index} className='checkbox-item'>
              <input
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
              <label htmlFor={classe._id}>{classe.name}</label>
            </div>
          ))}
        </div>
      </div>

      <label>Titre:</label>
      <input data-testid='alert-title' value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Message:</label>
      <textarea data-testid='alert-message' value={message} onChange={(e) => setMessage(e.target.value)} />

      <label>Fichier joint (optionnel):</label>
      <input data-testid='alert-file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />

      {userRole === 'teacher'
        ? (<div><label>Questionnaire (optionnel):</label>
          <select onChange={(e) => setSelectedQuestionnaire(e.target.value)}>
            {questionnaires.map((questionnaire, index) => (
              <option key={index} value={questionnaire._id}>{questionnaire.title}</option>
            ))}
          </select>
        </div>)
        : ''}
      {!negativeResponse ? (<div>{positiveResponse}</div>) : (<div>{negativeResponse}</div>)}
      <button onClick={handleAlertSubmit}>Envoyer l'alerte</button>
    </div>
  )
}

export default AlertPage
