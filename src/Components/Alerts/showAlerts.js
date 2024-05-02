import { React, useState, useEffect } from 'react'
import '../../css/Components/Alerts/lastAlerts.scss'
import '../../css/pages/createAlerts.scss'
import moment from 'moment'
import rightArrowInverted from '../../assets/right-arrow-inverted.png'
import UserProfile from '../userProfile/userProfile'

export default function ShowAlerts (props) {
  const [errMessage, setErrMessage] = useState('')
  const [alerts, setAlerts] = useState([])
  const [chosenAlert, setChosenAlert] = useState({})

  useEffect(() => {
    async function getFile (id) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${id}`, {
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
        })
      })
      .catch((error) => {
        setErrMessage('Erreur : ', error.message)
      })
  }, [])

  const getChosenAlert = (alertId) => {
    const chosenAlert = Object.values(alerts).flat().find(alert => alert.id === alertId)
    setChosenAlert(chosenAlert) // Corrected to pass an object containing the new state
    props.upPosition()
  }

  return (
    <div className='page-alert' style={{ overflowY: 'auto' }}>
      {
        alerts ? '' : <p>Vous n'avez pas d'alerte pour le moment.</p>
      }
      {
        props.position === 0
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
          ))
          : <div id='alert-message-container'>
            <div id='alert-message-header'>
              <div id='alert-message-header-content'>
                <UserProfile
                  profile={chosenAlert.createdBy}
                />
                <div id='content-information'>
                  <span>{chosenAlert.title}</span>
                  <span style={{ fontSize: '20px' }}>Date de Publication : {chosenAlert.createdAt}</span>
                </div>
              </div>
              <div>
                {chosenAlert.file
                  ? <button id='alert-btn'>
                    <a style={{ textDecoration: 'none', color: 'white' }} href={chosenAlert.file} target='_blank' rel='noopener noreferrer'>
                      Télécharger la pièce-jointe
                    </a>
                  </button>
                  : ''}
              </div>
            </div>
            <div id='alert-message-message'>
              {chosenAlert.message}
            </div>
          </div>
      }
    </div>
  )
}
