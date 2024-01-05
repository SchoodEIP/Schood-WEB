import { React, useState, useEffect } from 'react'
import '../../css/Components/Alerts/lastAlerts.css'

export function LastAlerts () {
  const [errMessage, setErrMessage] = useState('')
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setAlerts(data)
        }
      })
      .catch((error) => {
        setErrMessage('Erreur : ', error)
      })
  }, [])

  return (
    <div className='alert-box'>
      <div className='alert-header'>
        <p className='title'>Mes Dernières Alertes</p>
      </div>
      <div className='alert-body'>
        <div className='alert-content'>
          {errMessage !== '' ? <p>{errMessage}</p> : ''}
          {alerts ?
            <p>Vous n'avez pas de nouvelle alerte.</p> :
            <p>Il y a des alertes</p>
          }
        </div>
      </div>
    </div>
  )
}
