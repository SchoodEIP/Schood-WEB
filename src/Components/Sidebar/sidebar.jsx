import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaHome, FaQuestion, FaChartBar, FaEnvelope, FaQuestionCircle, FaUsers, FaPlusCircle, FaExclamationCircle, FaHeadSideCough } from 'react-icons/fa'
import '../../css/Components/Sidebar/sidebar.scss'
import { WebsocketContext } from '../../contexts/websocket'
import userIcon from '../../assets/userIcon.png'
import feelingIcon from '../../assets/feelingsTab.png'
import { Tooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faFileLines, faMessage, faUser } from '@fortawesome/free-regular-svg-icons'
import { faAnglesDown, faChartLine, faCircleExclamation, faCircleInfo, faHeadSideCough, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import emoji1 from "../../assets/emojis/1.png" 
import emoji2 from "../../assets/emojis/2.png" 
import emoji3 from "../../assets/emojis/3.png" 
import emoji4 from "../../assets/emojis/4.png" 
import emoji5 from "../../assets/emojis/5.png"

import emoji1Selected from "../../assets/emojis/1s.png" 
import emoji2Selected from "../../assets/emojis/2s.png" 
import emoji3Selected from "../../assets/emojis/3s.png" 
import emoji4Selected from "../../assets/emojis/4s.png" 
import emoji5Selected from "../../assets/emojis/5s.png" 

export default function Sidebar () {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [dailyMood, setDailyMood] = useState(null)
  const [notification, setNotification] = useState({ message: false })
  // const [profile, setProfile] = useState(null)
  const [profile, setProfile] = useState()
  const { chats } = useContext(WebsocketContext)
  const location = useLocation()

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

  useEffect(() => {
    console.log(profile)
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  let pages = []

  if (sessionStorage.getItem('role') === 'administration' || sessionStorage.getItem('role') === 'admin') /* istanbul ignore next */ {
    pages = [
      { id: 'home', path: '/', icon: <FontAwesomeIcon icon={faHouse} style={{color: "#4f23e2",}} />, label: 'Accueil', selected: false },
      { id: 'accounts', path: '/accounts', icon: <FaUsers size={24} />, label: 'Comptes', selected: false },
      { id: 'messages', path: '/messages', icon: <FontAwesomeIcon icon={faMessage} size='2xl' style={{color: "#4f23e2",}} />, label: 'Messages', selected: false },
      { id: 'aides', path: '/aides', icon: <FontAwesomeIcon icon={faCircleInfo} size="2xl" style={{color: "#4f23e2",}} />, label: 'Aides', selected: false },
      { id: 'reports', path: '/reports', icon: <FaExclamationCircle size={24} />, label: 'Signalement', selected: false },
      { id: 'alertes', path: '/alerts', icon: <FaPlusCircle size={24} />, label: 'Alertes', selected: false }
    ]
  } else {
    pages = [
      { id: 'home', path: '/', icon: <FontAwesomeIcon icon={faHouse} size='2xl' style={{color: "#4f23e2",}} />, label: 'Accueil', selected: false },
      { id: 'questionnaires', path: '/questionnaires', icon: <FontAwesomeIcon  icon={faFileLines} size='2xl' style={{color: "#4f23e2",}} />, label: 'Mes questionnaires', selected: false },
      { id: 'statistiques', path: '/statistiques', icon: <FontAwesomeIcon icon={faChartLine} size='2xl' style={{color: "#4f23e2",}} />, label: 'Mes statistiques', selected: false },
      { id: 'messages', path: '/messages', icon: <FontAwesomeIcon icon={faMessage} size='2xl' style={{color: "#4f23e2",}} />, label: 'Mes messages', selected: false },
      { id: 'aides', path: '/aides', icon: <FontAwesomeIcon icon={faCircleInfo} size="2xl" style={{color: "#4f23e2",}} />, label: 'Mes aides', selected: false },
      { id: 'profile', path: '/profile', icon: <FontAwesomeIcon icon={faUser} size="2xl" style={{color: "#4f23e2",}} />, label: 'Mon profile', selected: false },
      { id: 'alerts', path: '/alerts', icon: <FontAwesomeIcon icon={faCircleExclamation} size="2xl" style={{color: "#4f23e2",}} />, label: 'Mes alertes', selected: false },
    ]
    if (sessionStorage.getItem('role') === 'student') /* istanbul ignore next */ {
      const feelingsObj = { id: 'ressentis', path: '/feelings', icon: <img id="feeling-icon" src={feelingIcon}/>, label: 'Mes ressentis' }
      pages.splice(6, 0, feelingsObj)
    }
  }

  const handleClick = (id) => /* istanbul ignore next */ {
    if (id === 'messages') setNotification({ message: false })
  }

  const handleClickDailyMood = (mood) => {
    setDailyMood(mood)
  }

  return (
    <>
      {isCollapsed && (
        <div id='collapsed'>
          <div id='top'>
            <div id='notifications' data-tooltip-id="notification-tooltip">
              <FontAwesomeIcon icon={faBell} size='xl' style={{color: "#4f23e2",}} />
            </div>
            <div id='profile'>
              <img src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : userIcon} alt="Image de profile"/>
            </div>
            <span id='divider'></span>
          </div>
          <div id='menu'>
            {pages.map((page, index) => (
              <div id='menu-item'>
                <Link to={page.path} onClick={() => /* istanbul ignore next */ { handleClick(page.id) }}>
                  <div id='icon'>
                    {page.icon}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div id='bottom'>
            <span id='divider'></span>
            <div onClick={() => toggleSidebar()} id='item'>
              <FontAwesomeIcon  size='2xl' icon={faAnglesDown} rotation={270} style={{color: "#4f23e2",}} />
            </div>
            <div onClick={() => disconnect()} id='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size="2xl" style={{color: "#4f23e2",}} />
            </div>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div id='expanded'>
          <div id='top'>
            <div id='notifications' data-tooltip-id="notification-tooltip">
              <FontAwesomeIcon icon={faBell} size='2xl' style={{color: "#4f23e2",}} />
            </div>
            <div id='profile'>
              <img src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : userIcon} alt="Image de profile"/>
              <div id='firstname-lastname'>
                <span>{profile?.firstname}</span>
                <span>{profile?.lastname}</span>
              </div>
            </div>
            <span id='divider'></span>
            <div id="daily-mood">
              <span>Mon humeur quotidienne</span>
              <div id='mood-icons'>
                <img src={dailyMood === 0 ? emoji1Selected : emoji1} onClick={() => handleClickDailyMood(0)} />
                <img src={dailyMood === 1 ? emoji2Selected : emoji2} onClick={() => handleClickDailyMood(1)}/>
                <img src={dailyMood === 2 ? emoji3Selected : emoji3} onClick={() => handleClickDailyMood(2)}/>
                <img src={dailyMood === 3 ? emoji4Selected : emoji4} onClick={() => handleClickDailyMood(3)}/>
                <img src={dailyMood === 4 ? emoji5Selected : emoji5} onClick={() => handleClickDailyMood(4)}/>
              </div>
            </div>
          </div>
          <div id='menu'>
            {pages.map((page, index) => (
              <div id='menu-item'>
                <Link to={page.path} onClick={() => /* istanbul ignore next */ { handleClick(page.id) }}>
                  <div id='icon'>
                    {page.icon} {page.label}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div id='bottom'>
            <span id='divider'></span>
            <div onClick={() => toggleSidebar()} id='item'>
              <FontAwesomeIcon size='2xl' icon={faAnglesDown} rotation={90} style={{color: "#4f23e2",}} /> Réduire
            </div>
            <div onClick={() => disconnect()} id='item'>
              <FontAwesomeIcon icon={faRightFromBracket} size="2xl" style={{color: "#4f23e2",}} /> Déconnexion
            </div>
          </div>
        </div>
      )}

      <Tooltip
        id="notification-tooltip"
        place="right"
        content="Notifications"
      />
    </>
  )

  // return (
  //   <>
  //     <div className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`} style={{ height: sidebarHeight }}>
  //       <button className={`sidebar-toggle ${isCollapsed ? 'collapsed' : 'expanded'}`} onClick={toggleSidebar}>
  //         {isCollapsed ? <FaBars size={24} /> : <FaTimes size={24} style={{ color: 'white' }} />}
  //       </button>
  //       <div className='sidebar-menu-container'>
  //         <ul className='sidebar-menu'>
  //           {pages.map((page, index) => (
  //             <li key={page.id} className='sidebar-menu-item' id={'sidebar-item-' + index}>
  //               <Link to={page.path} onClick={() => /* istanbul ignore next */ { handleClick(page.id) }}>
  //                 <span className='sidebar-menu-item-icon'>
  //                   {
  //                     (notification.message && page.id === 'messages') &&
  //                       <div className='sidebar-menu-item-icon-notification' />
  //                   }
  //                   {isCollapsed ? page.icon : <span>{page.icon}</span>}
  //                 </span>
  //                 {!isCollapsed && (
  //                   <span className='sidebar-menu-item-label'>{page.label}</span>
  //                 )}
  //               </Link>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   </>
  // )
}
