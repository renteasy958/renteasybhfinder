import React, { useState, useRef, useEffect } from 'react';
import '../styles/navbar.css';

const Navbar = ({ onNavigate, onSettingsClick }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <img src={require('../../images/logo.png')} alt="RentEasy Logo" />
      </div>
      
      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search boarding houses..." 
          className="navbar-search-input"
        />
        <button className="navbar-filter-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="8" cy="6" r="2"/>
            <circle cx="16" cy="12" r="2"/>
            <circle cx="12" cy="18" r="2"/>
          </svg>
        </button>
      </div>

      <div className="navbar-links">
        <button onClick={() => onNavigate('home')} className="navbar-link">Home</button>
        <button onClick={() => onNavigate('liked')} className="navbar-link">Liked</button>
        <div className="settings-dropdown" ref={settingsRef}>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="navbar-link">Settings</button>
          {isSettingsOpen && (
            <div className="settings-dropdown-menu">
              <button className="settings-dropdown-item" onClick={() => onNavigate('profile')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </button>
              <button className="settings-dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
        <button onClick={() => onNavigate('history')} className="navbar-link">History</button>
      </div>
    </nav>
  );
};

export default Navbar;
