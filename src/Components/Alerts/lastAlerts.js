import { React, useState, useEffect } from 'react'
import '../../css/Components/Alerts/lastAlerts.scss'
import moment from 'moment'
import { Link } from 'react-router-dom'
import rightArrow from '../../assets/right-arrow.png'
import rightArrowInverted from '../../assets/right-arrow-inverted.png'
import UserProfile from '../userProfile/userProfile'
import { disconnect } from '../../functions/sharedFunctions'

export function LastAlerts () {
  const [errMessage, setErrMessage] = useState('')
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    async function getFile (id) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${id}`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token')
          }
        })
        if (response.status === 403) {
          disconnect();
        }

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
      .then((response) => {
        if (response.status === 403) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => {
        const promisedList = buildList(data)
        console.log(data)
        promisedList.then((alertList) => setAlerts(alertList))
      })
      .catch((error) => {
        setErrMessage('Erreur : ', error.message)
      })
  }, [])

  return (
    <div className='alert-box'>
      <div className='alert-header'>
        <p className='title'>Mes Dernières Alertes</p>
        <Link to='/alerts' className='see-more'>
          Voir plus
          <img className='img' src={rightArrow} alt='Right arrow' />
        </Link>
      </div>
      <div className='alert-body'>
        {
          alerts.length > 0
            ? (
              <div className='w-100'>
                {alerts.map((alert, index) => (
                  <div key={index} className='alert-container'>
                    <div className='content'>
                      <div className='header'>
                        <div className='user-profile'>
                          <UserProfile
                            profile={alert.createdBy}
                          />
                        </div>
                        <Link to={'/alerts/' + alert.id} className='see-more-inverted'>
                          Voir plus
                          <img className='img' src={rightArrowInverted} alt='Right arrow' />
                        </Link>
                      </div>
                      <div className='body'>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )
            : (<p>Vous n'avez pas de nouvelle alerte.</p>)
        }
      </div>
    </div>
  )
}
