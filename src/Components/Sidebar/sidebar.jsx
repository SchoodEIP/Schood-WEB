import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaQuestion, FaChartBar, FaEnvelope, FaQuestionCircle, FaUsers, FaSignOutAlt, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa'
import '../../css/Components/Sidebar/sidebar.scss'
import Profile_Icon from "../../assets/Profile_Icon.png"

export default function Sidebar () {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [sidebarHeight, setSidebarHeight] = useState(window.innerHeight)
  const [activePage, setActivePage] = useState('');
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    const handleResize = () => {
      setSidebarHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const firstname = sessionStorage.getItem('firstname')
  const lastname = sessionStorage.getItem('lastname')

  let pages = []

  if (sessionStorage.getItem('role') === 'student' || sessionStorage.getItem('role') === 'teacher') {
    pages = [
      { id: 'home', path: '/', icon: <FaHome size={24} />, label: 'Accueil' },
      { id: 'questionnaires', path: '/questionnaires', icon: <FaQuestion size={24} />, label: 'Questionnaires' },
      { id: 'statistiques', path: '/statistiques', icon: <FaChartBar size={24} />, label: 'Statistiques' },
      { id: 'messages', path: '/messages', icon: <FaEnvelope size={24} />, label: 'Messages' },
      { id: 'aides', path: '/aides', icon: <FaQuestionCircle size={24} />, label: 'Aides' },
    ]
  } else {
    pages = [
      { id: 'home', path: '/', icon: <FaHome size={24} />, label: 'Accueil' },
      { id: 'accounts', path: '/accounts', icon: <FaUsers size={24} />, label: 'Accounts' },
      { id: 'statistiques', path: '/statistiques', icon: <FaChartBar size={24} />, label: 'Statistiques' },
      { id: 'messages', path: '/messages', icon: <FaEnvelope size={24} />, label: 'Messages' },
      { id: 'aides', path: '/aides', icon: <FaQuestionCircle size={24} />, label: 'Aides' },
    ]
  }

  useEffect(() => {
    const currentPath = location.pathname;

    const currentPage = pages.find(page => page.path === currentPath);

    if (currentPage) {
      setActivePage(currentPage.id);
    }
  }, [location.pathname, pages]);

  function handleLogout () {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    window.location.reload()
  }

  return (
    <>
      <div className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`} style={{ height: sidebarHeight }}>
        <div className='sidebar-menu-container'>
          <ul className='sidebar-menu'>
            { isCollapsed ? <div style={{"height":"122px"}}/> : <div id="sidebar-profile">
              <div id="profile-icon">
                <img src={Profile_Icon} alt="user" />
              </div>
              <div id="profile-name">
                <span>{firstname}</span>
                <span>{lastname}</span>
              </div>
            </div> }

            { isCollapsed ? null : <div className="horizontal-line"></div> }
            {pages.map((page, index) => (
              <li key={page.id} className={`sidebar-menu-item ${page.id === activePage ? 'active' : ''}`} id={'sidebar-item-' + index}>
                <Link to={page.path}>
                  <span className={`sidebar-menu-item-icon  ${page.id === activePage ? 'active' : ''}`}>
                    {isCollapsed ? page.icon : <span>{page.icon}</span>}
                  </span>
                  {!isCollapsed && (
                    <span className={`sidebar-menu-item-label ${page.id === activePage ? 'active' : ''}`}>{page.label}</span>
                  )}
                </Link>
              </li>
            ))}
            { isCollapsed ? null : <div className="horizontal-line"></div> }
            <li className='sidebar-menu-item' id={'sidebar-item-resize'}>
              <Link onClick={toggleSidebar} >
                <span className='sidebar-menu-item-icon'>
                  {isCollapsed ? < FaAngleDoubleRight size={24} /> : <span>< FaAngleDoubleLeft size={24} /></span>}
                </span>
                {!isCollapsed && (
                  <span className='sidebar-menu-item-label'>Réduire</span>
                )}
              </Link>
            </li>
            <li className='sidebar-menu-item' id={'sidebar-item-logout'}>
              <Link onClick={handleLogout} >
                <span className='sidebar-menu-item-icon'>
                  {isCollapsed ? <FaSignOutAlt size={24} /> : <span><FaSignOutAlt size={24} /></span>}
                </span>
                {!isCollapsed && (
                  <span className='sidebar-menu-item-label'>Déconnexion</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
