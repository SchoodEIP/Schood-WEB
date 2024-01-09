import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../../css/pages/createAlerts.scss'

const AlertPage = () => {
  const [userRoles, setUserRoles] = useState([])
  const [userClasses, setUserClasses] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState('')
  const [selectedClasses, setSelectedClasses] = useState([])
  const [file, setFile] = useState(null)
  const [questionnaires, setQuestionnaires] = useState([])
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('')
  const userRole = localStorage.getItem('role')
  const [isClass, setIsClass] = useState(false)

  useEffect(() => {
    // Requête GET : récupération de la liste des types d’utilisateurs
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`, {
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setRole(response.data.roles[0]._id)
        setUserRoles(response.data.roles)
      })
      .catch(error => console.error('Erreur lors de la récupération des types d\'utilisateurs', error.message))

    // Requête GET : récupération des classes dont l’utilisateur est en charge
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/adm/classes`, {
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => setUserClasses(response.data))
      .catch(error => console.error('Erreur lors de la récupération des classes', error.message))

    // Requête GET : liste des questionnaires à venir et en cours
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`, {
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setQuestionnaires(response.data)
      })
      .catch(error => console.error('Erreur lors de la récupération des questionnaires', error.message))
  }, [])

  const handleAlertSubmit = () => {
    // Requête POST: envoyer l’alerte
    const data = {
      title,
      message,
      role: !isClass ? role : null,
      classes: isClass ? selectedClasses : [],
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shared/alert`, data, {
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      },
    })
      .then(response => {
        console.log('Alerte envoyée avec succès', response.data)
      })
      .catch(error => console.error('Erreur lors de l\'envoi de l\'alerte', error))
  }

  const handleAlertType = () => {
    const rolesContainer = document.getElementById('roles-container')
    const classesContainer = document.getElementById('classes-container')
    if (!isClass) {
      classesContainer.style.display = 'none'
      rolesContainer.style.display = 'flex'
      setIsClass(true)
    } else {
      classesContainer.style.display = 'flex'
      rolesContainer.style.display = 'none'
      setIsClass(false)
    }
  }

  return (
    <div className='alert-page'>
      <h1>Créer une alerte</h1>

      <div>
        <button className={isClass ? '' : 'no-interaction-btn'} onClick={handleAlertType}>Rôles</button>
        <button className={isClass ? 'no-interaction-btn' : ''} onClick={handleAlertType}>Classes</button>
      </div>
      <div id="roles-container" >
        <label>Type d'utilisateur visé:</label>
        <select onChange={(e) => setRole(e.target.value)}>
          {userRoles.map((role, index) => (
            <option key={index} value={role._id}>{role.name}</option>
          ))}
        </select>
      </div>

      <div id="classes-container">
        <label>Classes:</label>
        <div className='checkbox-list'>
          {userClasses.map((classe, index) => (
            <div key={index} className='checkbox-item'>
              <input
                type='checkbox'
                id={`class-check-${index}`}
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
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Message:</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

      <label>Fichier joint (optionnel):</label>
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />

      {userRole === 'teacher' ?
      (<div><label>Questionnaire (optionnel):</label>
      <select onChange={(e) => setSelectedQuestionnaire(e.target.value)}>
        {questionnaires.map((questionnaire, index) => (
          <option key={index} value={questionnaire._id}>{questionnaire.title}</option>
        ))}
      </select></div>) : ''
      }

      <button onClick={handleAlertSubmit}>Envoyer l'alerte</button>
    </div>
  )
}

export default AlertPage
