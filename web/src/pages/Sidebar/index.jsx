import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaQuestion, FaChartBar, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';
import '../../styles/sidebar.scss';

const Sidebar = ({ pages = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="sidebar-container">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      {isCollapsed ? (
        <ul className="sidebar-menu">
          {pages &&
            pages.length &&
            pages.map((page) => (
              <li key={page.id} className="sidebar-menu-item">
                <Link to={page.path}>
                  <span className="sidebar-menu-item-icon">{page.icon}</span>
                  <span className="sidebar-menu-item-label">{page.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      ) : (
        <ul className="sidebar-menu">
          <li key="home" className="sidebar-menu-item">
            <Link to="/">
              <span className="sidebar-menu-item-icon">
                <FaHome />
              </span>
              <span className="sidebar-menu-item-label">Accueil</span>
            </Link>
          </li>
          <li key="questionnaire" className="sidebar-menu-item">
            <Link to="/questionnaire">
              <span className="sidebar-menu-item-icon">
                <FaQuestion />
              </span>
              <span className="sidebar-menu-item-label">Questionnaire</span>
            </Link>
          </li>
          <li key="statistiques" className="sidebar-menu-item">
            <Link to="/statistiques">
              <span className="sidebar-menu-item-icon">
                <FaChartBar />
              </span>
              <span className="sidebar-menu-item-label">Statistiques</span>
            </Link>
          </li>
          <li key="messages" className="sidebar-menu-item">
            <Link to="/messages">
              <span className="sidebar-menu-item-icon">
                <FaEnvelope />
              </span>
              <span className="sidebar-menu-item-label">Messages</span>
            </Link>
          </li>
          <li key="aides" className="sidebar-menu-item">
            <Link to="/aides">
              <span className="sidebar-menu-item-icon">
                <FaQuestionCircle />
              </span>
              <span className="sidebar-menu-item-label">Aides</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
