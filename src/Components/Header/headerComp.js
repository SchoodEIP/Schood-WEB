import React, {useState, useEffect, useContext} from 'react'
import backButton from '../../assets/backButton.png'
import '../../css/Components/Header/headerComp.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { WebsocketContext } from '../../contexts/websocket'
import Popup from 'reactjs-popup'
import moment from 'moment'
import {disconnect} from '../../functions/disconnect'

import '../../css/Components/Popup/popup.scss'

import userIcon from '../../assets/userIcon.png'
import cross from '../../assets/Cross.png'

import { faBell } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function HeaderComp ({ title, withLogo = true, subtitle, withReturnBtn = false, position = -1, returnCall, showButtons = false, buttonComponent }) {
  const navigate = useNavigate()
  // const [nbNotifications, setNbNotification] = useState(0)
  // const [notification, setNotification] = useState({ message: false })
  const { chats } = useContext(WebsocketContext)
  // const [isAnswered, setIsAnswered] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const role = (sessionStorage.getItem('role'))
  const [profile, setProfile] = useState(null)
  const location = useLocation()

  const goBack = () => {
    navigate(-1)
  }

  const handleNotifications = () => /* istanbul ignore next */ {
    if (chats.value.notified) {
      if (location.pathname !== '/messages') {
        // setNotification({ message: true })
      } else {
        if (chats.value.unseenChats.length === 0) {
          // setNotification({ message: false })
          chats.setChats({ ...chats.value, notified: false })
        }
      }
    }
  }

  const getUnseenNotifications = () => {

  }

  useEffect(handleNotifications, [chats.value.notified, chats.value.unseenChats])

  useEffect(() => {
    getUnseenNotifications()
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])


  function handleGetNotifications () {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/notifications/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setNotifications(data)
        // setNbNotification(data.length)
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error(error)
        // setErrMessage('Erreur : ', error.message)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(handleGetNotifications, 30000)

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleShowNotifications = () => {
    setIsShown(!isShown)
    handleGetNotifications()
  }


  return (
    <div id='header'>
      <Popup open={isShown} onClose={handleShowNotifications} modal>
        {(close) => (
          <div style={{ marginTop: '25px' }} className='popup-modal-container'>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <div className='content'>
              {notifications && notifications.map((notif, index) => (
                <div key={index} className='notification-container'>
                  <div className='notification-header'>
                    <span>{notif.title}</span>
                    <span>{moment(notif.date).format('HH:mm DD/MM')}</span>
                  </div>
                  <div className='notification-content'>
                    <span>{notif.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Popup>
      <div id='left'>
        {title && (
          <div id='title'>
            {title}
          </div>
        )}
        {subtitle && (
          <div id='subtitle'>
            {subtitle}
          </div>
        )}
        {withReturnBtn && (
          <div id='withReturnBtn' onClick={position < 0 ? goBack : returnCall}>
            <img id='return-btn' src={backButton} alt='Return' />
            <div id='back-text'>
              Retour
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '25px' }}>
        {showButtons
          ? (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
              {buttonComponent.map((btn, index) => {
                return <button className='header-btn' key={index} onClick={btn.handleFunction}>{btn.name}</button>
              })}
            </div>
            )
          : ''}
        {withLogo && (
            <div className='profile' style={{display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center"}}>
              <div className='firstname-lastname' style={{display: "flex", flexDirection: "column", color: '#4f23e2', fontFamily: 'Inter', fontSize: "larger"}}>
                <span>{profile?.firstname}</span>
                <span>{profile?.lastname}</span>
              </div>
              <img style={{width: "25%", borderRadius: "50%"}} src={profile?.picture ? profile.picture : userIcon} alt='Image de profile' />
              <div style={{ background: 'none' }} onClick={handleShowNotifications} className='notifications' data-tooltip-id='notification-tooltip'>
                <FontAwesomeIcon icon={faBell} style={{ fontSize: "3em", cursor: "pointer", color: '#4f23e2' }} />
              </div>
            </div>
        )}
      </div>
    </div>
  )
}
