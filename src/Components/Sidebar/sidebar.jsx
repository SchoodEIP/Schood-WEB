import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WebsocketContext } from '../../contexts/websocket'
import Popup from 'reactjs-popup'
import { Tooltip } from 'react-tooltip'
import moment from 'moment'
import logoSchood from '../../assets/logo_schood.png'
import { toast } from 'react-toastify'

import { FaUsers, FaExclamationCircle } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import '../../css/Components/Popup/popup.scss'
import '../../css/Components/Sidebar/sidebar.scss'

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
import feelingIcon from '../../assets/sidenav/feeling-icon.png'
import feelingIconSelected from '../../assets/sidenav/feeling-icon-selected.png'
import alertsIcon from '../../assets/sidenav/alerts-icon.png'
import alertsIconSelected from '../../assets/sidenav/alerts-icon-selected.png'

import schoodIcon from '../../assets/sidenav/schood-icon.png'

export default function Sidebar () {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [dailyMood, setDailyMood] = useState(null)
  const { chats } = useContext(WebsocketContext)
  const location = useLocation()
  const [isShown, setIsShown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const role = (sessionStorage.getItem('role'))

  const handleNotifications = () => {
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

  const getDailyMood = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setDailyMood(null)
        if (data.mood) {
          setDailyMood(data.mood)
        }
      })
      .catch((e) => { toast.error(e.statusText) })
  }

  const getUnseenNotifications = () => {
    // Implement your logic here
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
    if (role === 'student') {
      getDailyMood()
    }
    // setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  let pages = []

  if (sessionStorage.getItem('role') === 'administration' || sessionStorage.getItem('role') === 'admin') {
    pages = [
      { id: 'home', path: '/', icon: <img className='icons' src={homeIcon} />, iconSelected: <img className='icons' src={homeIconSelected} />, label: 'Accueil', title: 'Accueil', selected: IsCurrentPage('/', true) },
      { id: 'accounts', path: '/accounts', icon: <FaUsers size={24} />, label: 'Comptes', title: 'Comptes', selected: IsCurrentPage('/accounts', false) },
      { id: 'messages', path: '/messages', icon: <img className='icons' src={chatIcon} />, iconSelected: <img className='icons' src={chatIconSelected} />, label: 'Messages', title: 'Messages', selected: IsCurrentPage('/messages', false) },
      { id: 'aides', path: '/aides', icon: <img className='icons' src={helpIcon} />, iconSelected: <img className='icons' src={helpIconSelected} />, label: 'Aides', title: 'Aides', selected: IsCurrentPage('/aides', false) },
      { id: 'alertes', path: '/alerts', icon: <img className='icons' src={alertsIcon} />, iconSelected: <img className='icons' src={alertsIconSelected} />, label: 'Alertes', title: 'Alertes', selected: IsCurrentPage('/alerts', false) }
    ]
    if (sessionStorage.getItem('role') === 'administration') {
      const reportObj = { id: 'reports', path: '/reports', icon: <FaExclamationCircle size={24} />, label: 'Signalements', title: 'Signalements', selected: IsCurrentPage('/reports', false) }
      pages.splice(4, 0, reportObj)
      const feelingsModerationObj = { id: 'ressentis', path: '/feelings', icon: <img className='icons' src={feelingIcon} />, iconSelected: <img className='icons' src={feelingIconSelected} />, label: 'Mes ressentis', title: 'Mes ressentis', selected: IsCurrentPage('/feelings', false) }
      pages.splice(4, 0, feelingsModerationObj)
      const statObj = { id: 'statistiques', path: '/statistiques', icon: <img className='icons' src={statsIcon} />, iconSelected: <img className='icons' src={statsIconSelected} />, label: 'Mes statistiques', title: 'Mes statistiques', selected: IsCurrentPage('/statistiques', false) }
      pages.splice(4, 0, statObj)
    }
  } else {
    pages = [
      { id: 'home', path: '/', icon: <img className='icons' src={homeIcon} />, iconSelected: <img className='icons' src={homeIconSelected} />, label: 'Accueil', title: 'Accueil', selected: IsCurrentPage('/', true) },
      { id: 'questionnaires', path: '/questionnaires', icon: <img className='icons' src={surveyIcon} />, iconSelected: <img className='icons' src={surveyIconSelected} />, label: 'Mes questionnaires', title: 'Mes questionnaires', selected: IsCurrentPage('/questionnaire', false) },
      { id: 'statistiques', path: '/statistiques', icon: <img className='icons' src={statsIcon} />, iconSelected: <img className='icons' src={statsIconSelected} />, label: 'Mes statistiques', title: 'Mes statistiques', selected: IsCurrentPage('/statistiques', false) },
      { id: 'messages', path: '/messages', icon: <img className='icons' src={chatIcon} />, iconSelected: <img className='icons' src={chatIconSelected} />, label: 'Mes messages', title: 'Mes messages', selected: IsCurrentPage('/messages', false) },
      { id: 'aides', path: '/aides', icon: <img className='icons' src={helpIcon} />, iconSelected: <img className='icons' src={helpIconSelected} />, label: 'Mes aides', title: 'Mes aides', selected: IsCurrentPage('/aides', false) },
      { id: 'alerts', path: '/alerts', icon: <img className='icons' src={alertsIcon} />, iconSelected: <img className='icons' src={alertsIconSelected} />, label: 'Mes alertes', title: 'Mes alertes', selected: IsCurrentPage('/alerts', false) }
    ]
    if (sessionStorage.getItem('role') === 'student') {
      const feelingsObj = { id: 'ressentis', path: '/feelings', icon: <img className='icons' src={feelingIcon} />, iconSelected: <img className='icons' src={feelingIconSelected} />, label: 'Mes ressentis', title: 'Mes ressentis', selected: IsCurrentPage('/feelings', false) }
      pages.splice(6, 0, feelingsObj)
    } else {
      const accountsObj = { id: 'accounts', path: '/accounts', icon: <FaUsers size={24} />, label: 'Comptes', title: 'Comptes', selected: IsCurrentPage('/accounts', false) }
      pages.splice(6, 0, accountsObj)
    }
  }

  const handleClick = (id) => {
    // Implement your logic here
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
        if (response.status === 401) {
          disconnect()
        } else {
          setDailyMood(mood)
          toast.success('Votre humeur du jour a été prise en compte.')
        }
      })
      .catch((error) => {
        toast.error(error.statusText)
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
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then((data) => {
        setNotifications(data)
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(handleGetNotifications, 30000)

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
      {isCollapsed && (
        <div data-testid='expanded' className='collapsed'>
          <div className='top'>
            <Link to='/'>
              <img style={{ width: '90%', paddingTop: '10px' }} id='logo' src={schoodIcon} alt='Schood' />
            </Link>
            <span className='divider' />
          </div>
          <div className='menu'>
            {pages.map((page, index) => (
              <div key={index} className={[page.selected ? 'menu-item-selected' : 'menu-item']}>
                <Link className='link' to={page.path} onClick={() => { handleClick(page.id) }}>
                  <div className='icon'>
                    {page.selected && page.iconSelected ? page.iconSelected : page.icon}
                  </div>
                </Link>
                <span className={[page.selected ? 'selected' : '']} />
                <span className={[page.selected ? 'selected' : '']} />
              </div>
            ))}
          </div>
          <div className='bottom'>
            <span className='divider' />
            <div data-testid='sidebar-expander' onClick={() => toggleSidebar()} className='item'>
              <FontAwesomeIcon size='2xl' icon={faAnglesDown} rotation={270} style={{ color: '#4f23e2' }} />
            </div>
            <div onClick={() => disconnect()} className='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size='2xl' style={{ color: '#4f23e2' }} />
            </div>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div data-testid='expanded' className='expanded'>
          <div className='top'>
            <Link to='/'>
              <img
                style={{ width: '90%', padding: '20px', height: '83px' }} id='logo' src={logoSchood} alt='Schood'
              />
            </Link>
            <span className='divider' />
            {role === 'student' && (
              <div className='daily-mood'>
                <span>Mon humeur quotidienne</span>
                <div className='mood-icons'>
                  <img data-testid='mood-0' alt='Très mauvaise humeur' src={dailyMood === 0 ? emoji1Selected : emoji1} onClick={() => handleClickDailyMood(0)} />
                  <img data-testid='mood-1' alt='Mauvaise humeur' src={dailyMood === 1 ? emoji2Selected : emoji2} onClick={() => handleClickDailyMood(1)} />
                  <img data-testid='mood-2' alt='Humeur neutre' src={dailyMood === 2 ? emoji3Selected : emoji3} onClick={() => handleClickDailyMood(2)} />
                  <img data-testid='mood-3' alt='Bonne humeur' src={dailyMood === 3 ? emoji4Selected : emoji4} onClick={() => handleClickDailyMood(3)} />
                  <img data-testid='mood-4' alt='Très bonne humeur' src={dailyMood === 4 ? emoji5Selected : emoji5} onClick={() => handleClickDailyMood(4)} />
                </div>
              </div>
            )}
          </div>
          <div className='menu'>
            {pages.map((page, index) => (
              <div key={index} className={[page.selected ? 'menu-item-selected' : 'menu-item']}>
                <Link className='link' to={page.path} onClick={() => { handleClick(page.id) }}>
                  <div className='icon'>
                    {page.selected && page.iconSelected ? page.iconSelected : page.icon} <span className='label'>{page.label}</span>
                  </div>
                </Link>
                <span className={[page.selected ? 'selected' : '']} />
                <span className={[page.selected ? 'selected' : '']} />
              </div>
            ))}
          </div>
          <div className='bottom'>
            <span className='divider' />
            <div data-testid='sidebar-collapser' onClick={() => toggleSidebar()} className='item'>
              <FontAwesomeIcon size='2xl' icon={faAnglesDown} rotation={90} style={{ color: '#4f23e2' }} /> Réduire
            </div>
            <div onClick={() => disconnect()} className='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size='2xl' style={{ color: '#4f23e2' }} /> Déconnection
            </div>
          </div>
        </div>
      )}

      <Tooltip
        className='notification-tooltip'
        place='right'
        content='Notifications'
      />
    </>
  )
}
