import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaQuestion, FaChartBar, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import '../../styles/sidebar.scss';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sidebarHeight, setSidebarHeight] = useState(window.innerHeight);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pages = [
    { id: 'home', path: '/Adm/Home', icon: <FaHome size={24} />, label: 'Accueil' },
    { id: 'accounts', path: '/Adm/Accounts', icon: <FaQuestion size={24} />, label: 'Accounts' },
    { id: 'statistiques', path: '/statistiques', icon: <FaChartBar size={24} />, label: 'Statistiques' },
    { id: 'messages', path: '/messages', icon: <FaEnvelope size={24} />, label: 'Messages' },
    { id: 'aides', path: '/aides', icon: <FaQuestionCircle size={24} />, label: 'Aides' },
  ];

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : 'expanded'}`} style={{ height: sidebarHeight }}>
      <button className={`sidebar-toggle ${isCollapsed ? 'collapsed' : 'expanded'}`} onClick={toggleSidebar}>
        {isCollapsed ? <FaBars size={24} /> : <FaTimes size={24} />}
      </button>
      <div className="sidebar-menu-container">
        <ul className="sidebar-menu">
          {pages.map((page) => (
            <li key={page.id} className="sidebar-menu-item">
              <Link to={page.path}>
                <span className="sidebar-menu-item-icon">
                  {isCollapsed ? page.icon : <span>{page.icon}</span>}
                </span>
                {!isCollapsed && (
                  <span className="sidebar-menu-item-label">{page.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
