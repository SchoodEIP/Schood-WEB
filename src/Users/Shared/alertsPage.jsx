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
import AlertModificationPopupContent from '../../Components/Popup/alertModification.jsx'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'
import AlertDeletionPopupContent from '../../Components/Popup/alertDeletion'

const AlertsPage = () => {
  const roleProfile = sessionStorage.getItem('role')
  const [isOpen, setIsOpen] = useState(false)
  const [isModifying, setIsModifying] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [chosenAlert, setChosenAlert] = useState({})
  const { id } = useParams()
  const [errMessage, setErrMessage] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        disconnect()
        return
      }

      if (response.status !== 200) {
        throw new Error('Erreur lors de la réception des alertes.')
      }

      const data = await response.json()
      const alertList = await buildList(data)
      const groupedData = {}

      alertList.forEach((item) => {
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
        const csnAlert = Object.values(groupedData).flat().find((alert) => alert.id === id)
        setChosenAlert(csnAlert)
      }
    } catch (error) {
      console.error('Erreur : ', error.message)
    }
  }

  const buildList = async (dataList) => {
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
          role: data.role,
          forClasses: data.forClasses,
          classes: data.classes,
          file: fileUrl,
          createdBy: data.createdBy,
          createdAt: moment(data.createdAt).format('DD/MM/YYYY')
        }
        alertList.push(showAlert)
      }
    }
    return alertList
  }

  const getFile = async (fileID) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/file/${fileID}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        }
      })

      if (response.status === 401) {
        disconnect()
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

  const handleEditAlert = (alert, onClose) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${alert.id}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alert)
    })
      .then((response) => {
        if (response.ok) {
          fetchAlerts() // Rafraîchir la liste des alertes après modification
          setIsModifying(false)
          toast.success('L\'alerte a été modifiée avec succès.')
          onClose()
        } else {
          setErrMessage('Erreur lors de la mise à jour')
        }
      })
      .catch((error) => console.error('Erreur : ', error))
  }

  const handleDeleteAlert = (alertId, close) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/${alertId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => {
        if (response.ok) {
          fetchAlerts() // Rafraîchir la liste des alertes après suppression
          setChosenAlert('')
          toast.success('L\'alerte a été supprimée avec succès.')
          close()
        } else {
          toast.error('Erreur lors de la suppression')
        }
      })
      .catch((error) => toast.error('Erreur : ', error))
  }

  useEffect(() => {
    fetchAlerts()
  }, [id])

  const getChosenAlert = (alertId) => {
    const csnAlert = Object.values(alerts).flat().find((alert) => alert.id === alertId)
    setChosenAlert(csnAlert)
    if (id === undefined) { window.location.href = '/alerts/' + alertId }
  }

  const returnToAlertList = () => {
    window.location.href = '/alerts/'
  }

  const handleNewAlert = () => {
    setIsOpen(!isOpen)
  }

  const handleModifying = () => {
    setIsModifying(!isModifying)
  }

  const handleDeleting = () => {
    setIsDeleting(!isDeleting)
  }

  const buttonComponent = [
    {
      name: 'Créer une alerte',
      handleFunction: handleNewAlert
    }
  ]

  const advancedButtonComponent = [
    {
      name: 'Modifier',
      handleFunction: handleModifying
    },
    {
      name: 'Supprimer',
      handleFunction: handleDeleting
    }
  ]

  return (
    <div>
      <div>
        <HeaderComp
          title='Mes Alertes'
          withLogo
          withReturnBtn={!!id}
          returnCall={returnToAlertList}
          showButtons={roleProfile !== 'student'}
          buttonComponent={id && chosenAlert ? advancedButtonComponent : buttonComponent}
        />
      </div>
      <div className='alert-page' style={{ marginLeft: '25px' }}>
        <Popup open={isOpen} onClose={() => setIsOpen(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img data-testid='close-img' src={cross} alt='Close' /></button>
              <AlertCreationPopupContent onClose={close} />
            </div>
          )}
        </Popup>
        <Popup open={isModifying} onClose={() => setIsModifying(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img data-testid='close-img' src={cross} alt='Close' /></button>
              <AlertModificationPopupContent onClose={close} chosenAlert={chosenAlert} handleEditAlert={handleEditAlert} errMessage={errMessage} />
            </div>
          )}
        </Popup>
        <Popup open={isDeleting} onClose={() => setIsDeleting(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img data-testid='close-img' src={cross} alt='Close' /></button>
              <AlertDeletionPopupContent onClose={close} chosenAlert={chosenAlert} handleDeleteAlert={handleDeleteAlert} />
            </div>
          )}
        </Popup>
        {
          id === undefined
            ? Object.entries(alerts).map(([day, items]) => (
              <div className='alert-page-container' key={day}>
                <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'start', alignItems: 'center' }}>
                  <h2 className='day-title'>{day}</h2>
                  <div className='breakline' />
                </div>
                <div className='day-container'>
                  {items.map((alert) => (
                    <div key={alert.id} className='alert-container'>
                      <div className='content'>
                        <div className='header'>
                          <UserProfile profile={alert.createdBy} />
                          <button data-testid={alert.id} id={alert.id} key={alert.id} onClick={() => getChosenAlert(alert.id)} className='see-more-inverted'>
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
            : <ShowAlerts chosenAlert={chosenAlert} />
        }
      </div>
    </div>
  )
}

export default AlertsPage
