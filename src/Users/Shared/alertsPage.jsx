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
import AlertCreationPopupContent from '../../Components/Popup/alertCreation'
import { disconnect } from '../../functions/sharedFunctions'

const AlertsPage = () => {
  const roleProfile = sessionStorage.getItem('role')
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
    async function getFile (fileID) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${fileID}`, {
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
              <AlertCreationPopupContent/>
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
