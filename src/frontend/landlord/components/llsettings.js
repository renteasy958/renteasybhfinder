import React from 'react';
import '../styles/llsettings.css';
import LLNavbar from './llnavbar';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';

const LLSettings = ({ onNavigate }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userData');
      localStorage.removeItem('currentPage');
      onNavigate('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="llsettings-container">
      <LLNavbar onNavigate={onNavigate} />
      <div className="llsettings-content">
        <div className="settings-list">
          <div className="settings-item" onClick={() => onNavigate('llprofile')}>
            <span className="settings-label">Profile</span>
            <span className="settings-arrow">›</span>
          </div>
          
          <div className="settings-item" onClick={() => onNavigate('llverify')}>
            <span className="settings-label">Verify Account</span>
            <span className="settings-arrow">›</span>
          </div>
          
          <div className="settings-item" onClick={handleLogout}>
            <span className="settings-label">Logout</span>
            <span className="settings-arrow">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLSettings;
