import React from 'react';
import '../styles/navbar.css';

const Navbar = ({ onNavigate }) => {
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
        <button onClick={() => onNavigate('settings')} className="navbar-link">Settings</button>
        <button onClick={() => onNavigate('history')} className="navbar-link">History</button>
      </div>
    </nav>
  );
};

export default Navbar;
