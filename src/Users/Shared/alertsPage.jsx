import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ShowAlerts from '../../Components/Alerts/showAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import Popup from 'reactjs-popup'
import moment from 'moment'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'
import cross from '../../assets/Cross.png'
import rightArrowInverted from '../../assets/right-arrow-inverted.png'
import UserProfile from '../../Components/userProfile/userProfile'

const AlertsPage = () => {
  const roleProfile = sessionStorage.getItem('role')
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
  const [errMessage, setErrMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [chosenAlert, setChosenAlert] = useState({})
  const { id } = useParams()

  const returnToAlertList = () => {
    window.location.href = '/alerts/'
  }

  const handleNewAlert = () => {
    setIsOpen(!isOpen)
  }

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
      .catch((error) => /* istanbul ignore next */ { setAlertResponse('Erreur lors de la récupération des roles', error.message) })

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
      .then(response => response.json())
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

  useEffect(() => {
    async function getFile (fileID) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${fileID}`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token')
          }
        })
        if (response.status !== 200) {
          throw new Error('Erreur lors de la réception du fichier.')
        } else {
          const blob = await response.blob()
          const objectURL = URL.createObjectURL(blob)
          return objectURL
        }
      } catch (e) {
        console.error(e)
      }
    }

    async function buildList (dataList) {
      const alertList = []
      if (dataList && dataList.length > 0) {
        for (const data of dataList) {
          let fileUrl = ''
          if (data.file) {
            fileUrl = await getFile(data.file)
          }
          const showAlert = {
            id: data._id,
            title: data.title,
            message: data.message,
            file: fileUrl,
            createdBy: data.createdBy,
            createdAt: moment(data.createdAt).format('DD/MM/YYYY')
          }
          alertList.push(showAlert)
        }
      }
      return alertList
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const promisedList = buildList(data)
        promisedList.then((alertList) => {
          const groupedData = {}
          alertList.forEach(item => {
            const parts = item.createdAt.split('/')
            const createdAt = new Date(parts[2], parts[1] - 1, parts[0])
            const date = createdAt.toLocaleDateString('fr-FR')
            if (!groupedData[date]) {
              groupedData[date] = []
            }
            groupedData[date].push(item)
          })
          setAlerts(groupedData)

          if (id !== undefined) {
            const csnAlert = Object.values(groupedData).flat().find(alert => alert.id === id)
            setChosenAlert(csnAlert)
          }
        })
      })
      .catch((error) => {
        setErrMessage('Erreur : ', error.message)
      })
  }, [id])

  const getChosenAlert = (alertId) => {
    const csnAlert = Object.values(alerts).flat().find(alert => alert.id === alertId)
    setChosenAlert(csnAlert)
    if (id === undefined)
      window.location.href = '/alerts/' + alertId
  }

  const buttonComponent = [
    {
      name: 'Créer une alerte',
      function: handleNewAlert
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title='Mes Alertes'
          withLogo
          withReturnBtn={id ? true : false}
          returnCall={returnToAlertList}
          showButtons={roleProfile !== 'student'}
          buttonComponent={buttonComponent}
        />
      </div>
      <div style={{ marginLeft: '25px' }}>
        <Popup open={isOpen} onClose={() => setIsOpen(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              {
                sessionStorage.getItem('role') === 'teacher'
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
            </div>
          )}
        </Popup>
        {
          id === undefined
            ? Object.entries(alerts).map(([day, items]) => (
              <div className='alert-page-container' key={day}>
                <div className='breakline' />
                <h2 className='day-title'>{day}</h2>
                <div className='day-container'>
                  {items.map(alert => (
                    <div key={alert.id} className='alert-container'>
                      <div className='content'>
                        <div className='header'>
                          <UserProfile
                            profile={alert.createdBy}
                          />
                          <button id={alert.id} key={alert.id} onClick={() => getChosenAlert(alert.id)} className='see-more-inverted'>
                            Voir plus
                          <img className='img' src={rightArrowInverted} alt='Right arrow' />
                          </button>
                        </div>
                        <div className='body'>
                          {alert.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )) : <ShowAlerts chosenAlert={chosenAlert} />
        }
      </div>
    </div>
  )
}

export default AlertsPage
