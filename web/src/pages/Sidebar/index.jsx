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
    <div className={`background ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
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
                </Link>
              </li>
            ))}
        </ul>
      ) : (
        <div className="sidebar-menu-container">
          <div className="sidebar-mini">
            <ul className="sidebar-menu">
              {pages &&
                pages.length &&
                pages.map((page) => (
                  <li key={page.id} className="sidebar-menu-item">
                    <Link to={page.path}>
                      <span className="sidebar-menu-item-icon">{page.icon}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="sidebar-content">
            <ul className="sidebar-menu-horizontal">
              <li key="home" className="sidebar-menu-item-horizontal">
                <Link to="/">
                  <span className="sidebar-menu-item-icon-horizontal">
                    <FaHome />
                  </span>
                  <span className="sidebar-menu-item-label-horizontal">Accueil</span>
                </Link>
              </li>
              <li key="questionnaire" className="sidebar-menu-item-horizontal">
                <Link to="/questionnaire">
                  <span className="sidebar-menu-item-icon-horizontal">
                    <FaQuestion />
                  </span>
                  <span className="sidebar-menu-item-label-horizontal">Questionnaire</span>
                </Link>
              </li>
              <li key="statistiques" className="sidebar-menu-item-horizontal">
                <Link to="/statistiques">
                  <span className="sidebar-menu-item-icon-horizontal">
                    <FaChartBar />
                  </span>
                  <span className="sidebar-menu-item-label-horizontal">Statistiques</span>
                </Link>
              </li>
              <li key="messages" className="sidebar-menu-item-horizontal">
                <Link to="/messages">
                  <span className="sidebar-menu-item-icon-horizontal">
                    <FaEnvelope />
                  </span>
                  <span className="sidebar-menu-item-label-horizontal">Messages</span>
                </Link>
              </li>
              <li key="aides" className="sidebar-menu-item-horizontal">
                <Link to="/aides">
                  <span className="sidebar-menu-item-icon-horizontal">
                    <FaQuestionCircle />
                  </span>
                  <span className="sidebar-menu-item-label-horizontal">Aides</span>
                </Link>
              </li>
            </ul>
            <div className="sidebar-menu-collapser" onClick={toggleSidebar}>
              <FaBars />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
