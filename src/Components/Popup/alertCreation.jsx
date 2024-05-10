import React, { useState, useEffect } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

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
    const [errMessage, setErrMessage] = useState('')

    useEffect(() => {
        // Requête GET : récupération de la liste des types d’utilisateurs
        fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/roles`, {
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
          .catch((error) => /* istanbul ignore next */ { setErrMessage('Erreur lors de la récupération des roles', error.message) })

        // Requête GET : récupération des classes dont l’utilisateur est en charge
        fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/classes`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then((data) => (data.message === 'Access Forbidden' ? setUserClasses([]) : setUserClasses(data)))
          .catch((error) => /* istanbul ignore next */ { setErrMessage('Erreur lors de la récupération des classes', error.message) })
    }, [])

    const handleAlertSubmit = async (e) => {
        e.preventDefault()
        let sendPost = true

        const data = {
          title,
          message,
          role: !isClass ? role : 'student',
          classes: isClass ? selectedClasses : []
        }

        if (title === '') {
            sendPost = false
            setErrMessage('Le titre est vide.')
        } else if (message === '') {
            sendPost = false
            setErrMessage('Le message est vide.')
        } else if (isClass && selectedClasses.length === 0) {
            sendPost = false
            setErrMessage("Aucune classe n'a été sélectionnée.")
        }

        const resetForm = () => {
            setTitle('')
            setMessage('')
            setSelectedClasses([])
            setIsClass(false)
            setFile(null)
            document.getElementById('file-input').value = ''
        }

        if (sendPost) {

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
                  setErrMessage('Alerte envoyée avec succès')
                  addFileToAlert(data._id)
                  resetForm()
                })
                .catch((error) => /* istanbul ignore next */ {
                  setErrMessage('Erreur lors de l\'envoi de l\'alerte', error)
                  resetForm()
                })

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
                        setErrMessage('Fichier envoyé avec l\'alerte avec succès')
                    })
                    .catch((error) => /* istanbul ignore next */ { setErrMessage('Erreur lors de l\'envoi du fichier avec l\'alerte', error) })
                }
            }
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
                        <option key={index} value={role._id}>{role.name}</option>
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
                <input id='file-input' type='file' onChange={(e) => setFile(e.target.files[0])} />
            </label>
            {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
            <button className='popup-btn' onClick={handleAlertSubmit}>Créer l'Alerte</button>
        </>
    )
}

export default AlertCreationPopupContent