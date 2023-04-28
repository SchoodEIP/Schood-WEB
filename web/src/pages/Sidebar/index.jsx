import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/sidebar.scss'

const Sidebar = ({ pages = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="background">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      {isCollapsed ? (
        <ul className="sidebar-menu">
          {pages && pages.length && pages.map((page) => (
            <li key={page.id} className="sidebar-menu-item">
              <Link to={page.path}>
                <span className="sidebar-menu-item-icon">{page.icon}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="sidebar-menu">
          {pages && pages.length && pages.map((page) => (
            <li key={page.id} className="sidebar-menu-item">
              <Link to={page.path}>
                <span className="sidebar-menu-item-icon">{page.icon}</span>
                <span className="sidebar-menu-item-name">{page.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
