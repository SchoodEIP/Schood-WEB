import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WebsocketContext } from '../../contexts/websocket'
import Popup from 'reactjs-popup'
import { Tooltip } from 'react-tooltip'
import moment from 'moment'

import { FaBars, FaTimes, FaHome, FaQuestion, FaChartBar, FaEnvelope, FaQuestionCircle, FaUsers, FaPlusCircle, FaExclamationCircle, FaHeadSideCough } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faFileLines, faMessage, faUser } from '@fortawesome/free-regular-svg-icons'
import { faAnglesDown, faChartLine, faCircleExclamation, faCircleInfo, faHeadSideCough, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import '../../css/Components/Popup/popup.scss'
import '../../css/Components/Sidebar/sidebar.scss'

import userIcon from '../../assets/userIcon.png'
import cross from '../../assets/Cross.png'

import emoji1 from '../../assets/emojis/1.png'
import emoji2 from '../../assets/emojis/2.png'
import emoji3 from '../../assets/emojis/3.png'
import emoji4 from '../../assets/emojis/4.png'
import emoji5 from '../../assets/emojis/5.png'

import emoji1Selected from '../../assets/emojis/1s.png'
import emoji2Selected from '../../assets/emojis/2s.png'
import emoji3Selected from '../../assets/emojis/3s.png'
import emoji4Selected from '../../assets/emojis/4s.png'
import emoji5Selected from '../../assets/emojis/5s.png'

import homeIcon from '../../assets/sidenav/home-icon.png'
import homeIconSelected from '../../assets/sidenav/home-icon-selected.png'
import surveyIcon from '../../assets/sidenav/survey-icon.png'
import surveyIconSelected from '../../assets/sidenav/survey-icon-selected.png'
import statsIcon from '../../assets/sidenav/stats-icon.png'
import statsIconSelected from '../../assets/sidenav/stats-icon-selected.png'
import chatIcon from '../../assets/sidenav/chat-icon.png'
import chatIconSelected from '../../assets/sidenav/chat-icon-selected.png'
import helpIcon from '../../assets/sidenav/help-icon.png'
import helpIconSelected from '../../assets/sidenav/help-icon-selected.png'
import profileIcon from '../../assets/sidenav/profile-icon.png'
import profileIconSelected from '../../assets/sidenav/profile-icon-selected.png'
import feelingIcon from '../../assets/sidenav/feeling-icon.png'
import feelingIconSelected from '../../assets/sidenav/feeling-icon-selected.png'
import alertsIcon from '../../assets/sidenav/alerts-icon.png'
import alertsIconSelected from '../../assets/sidenav/alerts-icon-selected.png'

export default function Sidebar () {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [dailyMood, setDailyMood] = useState(null)
  const [nbNotifications, setNbNotification] = useState(0)
  const [notification, setNotification] = useState({ message: false })
  const [profile, setProfile] = useState(null)
  const { chats } = useContext(WebsocketContext)
  const [isAnswered, setIsAnswered] = useState(false)
  const location = useLocation()
  const [isShown, setIsShown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [role, setRole] = useState(localStorage.getItem('role'))

  const handleNotifications = () => /* istanbul ignore next */ {
    if (chats.value.notified) {
      if (location.pathname !== '/messages') {
        setNotification({ message: true })
      } else {
        if (chats.value.unseenChats.length === 0) {
          setNotification({ message: false })
          chats.setChats({ ...chats.value, notified: false })
        }
      }
    }
  }

  const getDailyMood = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => {
        if (response.status === 403) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => {
        setIsAnswered(false)
        setDailyMood(null)
        if (data.mood) {
          setIsAnswered(true)
          setDailyMood(data.mood)
        }
      })
  }

  const getUnseenNotifications = () => {

  }

  useEffect(handleNotifications, [chats.value.notified, chats.value.unseenChats])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const disconnect = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('id')
    localStorage.removeItem('profile')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('profile')
    window.location.href = '/'
  }

  const IsCurrentPage = (page, home) => {
    const location = useLocation()

    if (home && location.pathname === '/') {
      return true
    }
    if (!home && location.pathname.includes(page)) {
      return true
    }
    return false
  }

  useEffect(() => {
    getUnseenNotifications()
    if (role) {
      getDailyMood()
    }
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  let pages = []

  if (sessionStorage.getItem('role') === 'administration' || sessionStorage.getItem('role') === 'admin') /* istanbul ignore next */ {
    pages = [
      { id: 'home', path: '/', icon: <img id='icons' src={homeIcon} />, iconSelected: <img id='icons' src={homeIconSelected} />, label: 'Accueil', title: 'Accueil', selected: IsCurrentPage('/', true) },
      { id: 'accounts', path: '/accounts', icon: <FaUsers size={24} />, label: 'Comptes', title: 'Comptes', selected: IsCurrentPage('/accounts', false) },
      { id: 'messages', path: '/messages', icon: <img id='icons' src={chatIcon} />, iconSelected: <img id='icons' src={chatIconSelected} />, label: 'Messages', title: 'Messages', selected: IsCurrentPage('/messages', false) },
      { id: 'aides', path: '/aides', icon: <img id='icons' src={helpIcon} />, iconSelected: <img id='icons' src={helpIconSelected} />, label: 'Aides', title: 'Aides', selected: IsCurrentPage('/aides', false) },
      { id: 'reports', path: '/reports', icon: <FaExclamationCircle size={24} />, label: 'Signalements', title: 'Signalement', selected: IsCurrentPage('/reports', false) },
      { id: 'alertes', path: '/alerts', icon: <img id='icons' src={alertsIcon} />, iconSelected: <img id='icons' src={alertsIconSelected} />, label: 'Alertes', title: 'Alertes', selected: IsCurrentPage('/alerts', false) }
    ]
  } else {
    pages = [
      { id: 'home', path: '/', icon: <img id='icons' src={homeIcon} />, iconSelected: <img id='icons' src={homeIconSelected} />, label: 'Accueil', title: 'Accueil', selected: IsCurrentPage('/', true) },
      { id: 'questionnaires', path: '/questionnaires', icon: <img id='icons' src={surveyIcon} />, iconSelected: <img id='icons' src={surveyIconSelected} />, label: 'Mes questionnaires', title: 'Mes questionnaires', selected: IsCurrentPage('/questionnaire', false) },
      { id: 'statistiques', path: '/statistiques', icon: <img id='icons' src={statsIcon} />, iconSelected: <img id='icons' src={statsIconSelected} />, label: 'Mes statistiques', title: 'Mes statistiques', selected: IsCurrentPage('/statistiques', false) },
      { id: 'messages', path: '/messages', icon: <img id='icons' src={chatIcon} />, iconSelected: <img id='icons' src={chatIconSelected} />, label: 'Mes messages', title: 'Mes messages', selected: IsCurrentPage('/messages', false) },
      { id: 'aides', path: '/aides', icon: <img id='icons' src={helpIcon} />, iconSelected: <img id='icons' src={helpIconSelected} />, label: 'Mes aides', title: 'Mes aides', selected: IsCurrentPage('/aides', false) },
      { id: 'profile', path: '/profile', icon: <img id='icons' src={profileIcon} />, iconSelected: <img id='icons' src={profileIconSelected} />, label: 'Mon profile', title: 'Mon profile', selected: IsCurrentPage('/profile', false) },
      { id: 'alerts', path: '/alerts', icon: <img id='icons' src={alertsIcon} />, iconSelected: <img id='icons' src={alertsIconSelected} />, label: 'Mes alertes', title: 'Mes alertes', selected: IsCurrentPage('/alerts', false) }
    ]
    if (sessionStorage.getItem('role') === 'student') /* istanbul ignore next */ {
      const feelingsObj = { id: 'ressentis', path: '/feelings', icon: <img id='icons' src={feelingIcon} />, iconSelected: <img id='icons' src={feelingIconSelected} />, label: 'Mes ressentis', title: 'Mes ressentis', selected: IsCurrentPage('/feelings', false) }
      pages.splice(6, 0, feelingsObj)
    }
  }

  const handleClick = (id) => /* istanbul ignore next */ {
    if (id === 'messages') setNotification({ message: false })
  }

  const handleClickDailyMood = (mood) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mood })
    })
      .then((response) => {
        if (response.status === 403) {
          disconnect();
        }
        setIsAnswered(true)
        setDailyMood(mood)
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error(error)
        // setErrMessage('Erreur : ', error.message)
      })
  }

  function handleGetNotifications () {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/notifications/`, {
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
        setNotifications(data)
        setNbNotification(data.length)
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
    <>
      <Popup open={isShown} onClose={handleShowNotifications} modal>
        {(close) => (
          <div className='popup-modal-container'>
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
      {isCollapsed && (
        <div id='collapsed'>
          <div id='top'>
            <button onClick={handleShowNotifications} id='notifications' data-tooltip-id='notification-tooltip'>
              <FontAwesomeIcon icon={faBell} size='xl' style={{ color: '#4f23e2' }} />
            </button>
            <div id='profile'>
              <img src={profile?.picture ? profile.picture : userIcon} alt='Image de profile' />
            </div>
            <span id='divider' />
          </div>
          <div id='menu'>
            {pages.map((page, index) => (
              <div key={index} className={[page.selected ? 'menu-item-selected' : 'menu-item']}>
                <Link id='link' to={page.path} onClick={() => /* istanbul ignore next */ { handleClick(page.id) }}>
                  <div id='icon'>
                    {page.selected && page.iconSelected ? page.iconSelected : page.icon}
                  </div>
                </Link>
                <span className={[page.selected ? 'selected' : '']} />
              </div>
            ))}
          </div>
          <div id='bottom'>
            <span id='divider' />
            <div onClick={() => toggleSidebar()} id='item'>
              <FontAwesomeIcon size='2xl' icon={faAnglesDown} rotation={270} style={{ color: '#4f23e2' }} />
            </div>
            <div onClick={() => disconnect()} id='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size='2xl' style={{ color: '#4f23e2' }} />
            </div>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div id='expanded'>
          <div id='top'>
            <button onClick={handleShowNotifications} id='notifications' data-tooltip-id='notification-tooltip'>
              <FontAwesomeIcon icon={faBell} size='2xl' style={{ color: '#4f23e2' }} />
            </button>
            <div id='profile'>
              <img src={profile?.picture ? profile.picture : userIcon} alt='Image de profile' />
              <div id='firstname-lastname'>
                <span>{profile?.firstname}</span>
                <span>{profile?.lastname}</span>
              </div>
            </div>
            <span id='divider' />
            {role && role === 'student' && (
              <div id='daily-mood'>
                <span>Mon humeur quotidienne</span>
                <div id='mood-icons'>
                  <img src={dailyMood === 0 ? emoji1Selected : emoji1} onClick={() => handleClickDailyMood(0)} />
                  <img src={dailyMood === 1 ? emoji2Selected : emoji2} onClick={() => handleClickDailyMood(1)} />
                  <img src={dailyMood === 2 ? emoji3Selected : emoji3} onClick={() => handleClickDailyMood(2)} />
                  <img src={dailyMood === 3 ? emoji4Selected : emoji4} onClick={() => handleClickDailyMood(3)} />
                  <img src={dailyMood === 4 ? emoji5Selected : emoji5} onClick={() => handleClickDailyMood(4)} />
                </div>
              </div>
            )}
          </div>
          <div id='menu'>
            {pages.map((page, index) => (
              <div key={index} className={[page.selected ? 'menu-item-selected' : 'menu-item']}>
                <Link id='link' to={page.path} onClick={() => /* istanbul ignore next */ { handleClick(page.id) }}>
                  <div id='icon'>
                    {page.selected && page.iconSelected ? page.iconSelected : page.icon} <span id='label'>{page.label}</span>
                  </div>
                </Link>
                <span className={[page.selected ? 'selected' : '']} />
              </div>
            ))}
          </div>
          <div id='bottom'>
            <span id='divider' />
            <div onClick={() => toggleSidebar()} id='item'>
              <FontAwesomeIcon size='2xl' icon={faAnglesDown} rotation={90} style={{ color: '#4f23e2' }} /> Réduire
            </div>
            <div onClick={() => disconnect()} id='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size='2xl' style={{ color: '#4f23e2' }} /> Déconnexion
            </div>
          </div>
        </div>
      )}

      <Tooltip
        id='notification-tooltip'
        place='right'
        content='Notifications'
      />
    </>
  )
}
