import { React, useState, useEffect } from 'react'
import '../../css/Components/Alerts/lastAlerts.css'
import moment from 'moment'

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
      </div>
      <div className='alert-body'>
        {errMessage !== '' ? <p>{errMessage}</p> : ''}
        {
          alerts.length > 0
            ? (
              <div>
                {alerts.map((alert, index) => (
                  <div key={index} className='alert-container'>
                    <div className='alert-title'>{alert.title}</div>
                    <div className='alert-message'>{alert.message}</div>
                    {alert.file
                      ? (
                        <div className='alert-file-btn' id={alert.id}>
                          <a style={{ textDecoration: 'none', color: 'white' }} href={alert.file} target='_blank' rel='noopener noreferrer'>
                            Télécharger le fichier
                          </a>
                        </div>)
                      : ''}
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
