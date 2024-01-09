import { React, useState, useEffect } from 'react'
import '../../css/Components/Alerts/lastAlerts.css'
import moment from 'moment'

export function LastAlerts () {
  const [errMessage, setErrMessage] = useState('')
  const [alerts, setAlerts] = useState([])
  // const [userList, setUserList] = useState([])

  useEffect(() => {
    // const findUserById = (id) => {
    //     return userList.find(user => user._id === id);
    // };

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
          const blob = response.blob()
          const objectURL = URL.createObjectURL(blob)
          return objectURL
        }
      } catch (e) {
        console.error(e)
      }
    }

    function buildList (dataList) {
      const alertList = []
      dataList.forEach((data, index) => {
        let fileUrl = ''
        if (data.file) {
          getFile(data.file).then((data) => {
            fileUrl = data
          })
            .catch((error) => {
              console.error('Erreur lors de la récupération du fichier :', error)
            })
        }

        const showAlert = {
          id: data._id,
          title: data.title,
          message: data.message,
          file: fileUrl,
          createdAt: moment(data.createdAt).format('DD/MM/YYYY')
          // createdBy: findUserById(data.createdBy),
        }
        alertList.push(showAlert)
      })
      console.log(alertList)
      return alertList
    }

    // fetch(`${process.env.REACT_APP_BACKEND_URL}/user/all/`, {
    //     method: 'GET',
    //     headers: {
    //       'x-auth-token': sessionStorage.getItem('token'),
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         setUserList(data)
    //     })
    //     .catch((error) => {
    //         setErrMessage('Erreur : ', error)
    //     })

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/alert/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // const placeholderList = [
        //   {
        //     title: 'Première Alerte',
        //     message: 'Ceci est la première alerte',
        //     classes: [],
        //     role: [],
        //     createdAt: '2023',
        //     createdBy: '0921',
        //     file: '',
        //     _id: '123'
        //   },
        //   {
        //     title: 'Mr Math',
        //     message: 'Des contacts pour le soutien scolaire se trouvent dans la partie aide',
        //     classes: [],
        //     role: [],
        //     createdAt: '2023',
        //     createdBy: '0921',
        //     file: 'math_file',
        //     _id: '132'
        //   }
        // ]
        // setAlerts(buildList(placeholderList))
        setAlerts(buildList(data))
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
                    {console.log(alert)}
                    {alert.file
                      ? (<div className='alert-file-btn' id={alert.id}>
                        <a href={alert.file} target='_blank' rel='noopener noreferrer'>
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
