import React, { useState, useRef, useEffect } from 'react';
import '../styles/llnavbar.css';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';

const LLNavbar = ({ onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    gcashNumber: ''
  });
  const settingsRef = useRef(null);

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

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalData({ ...withdrawalData, [name]: value });
  };

  const handleWithdrawalSubmit = () => {
    console.log('Withdrawal request:', withdrawalData);
    setShowWithdrawalModal(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setWithdrawalData({ amount: '', gcashNumber: '' });
    }, 5000);
  };

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
    <>
    <nav className="llnavbar-container">
      <div className="llnavbar-logo">
        <img src={require('../../images/logo.png')} alt="RentEasy Logo" />
      </div>

      <div className="llnavbar-center-links">
        <button onClick={() => onNavigate('llhome')} className="llnavbar-center-link">Home</button>
        <button onClick={() => onNavigate('llreservations')} className="llnavbar-center-link">Reservations</button>
        <div className="llsettings-dropdown" ref={settingsRef}>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="llnavbar-center-link">Settings</button>
          {isSettingsOpen && (
            <div className="llsettings-dropdown-menu">
              <button className="llsettings-dropdown-item" onClick={() => onNavigate('llprofile')}>
                <span>Profile</span>
              </button>
              <button className="llsettings-dropdown-item" onClick={() => onNavigate('llverify')}>
                <span>Verify Account</span>
              </button>
              <button className="llsettings-dropdown-item" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        <button onClick={() => onNavigate('llhistory')} className="llnavbar-center-link">History</button>
      </div>

      <div className="llnavbar-balance" onClick={() => setShowWithdrawalModal(true)}>
        Balance: ₱<span className="balance-amount">0.00</span>
      </div>
    </nav>

    {showWithdrawalModal && (
      <div className="modal-overlay" onClick={() => setShowWithdrawalModal(false)}>
        <div className="withdrawal-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={() => setShowWithdrawalModal(false)}>
            ×
          </button>
          <h3>Withdrawal Request</h3>
          <div className="withdrawal-form">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={withdrawalData.amount}
                onChange={handleWithdrawalChange}
                placeholder="Enter amount"
              />
            </div>
            <div className="form-group">
              <label>GCash Number</label>
              <input
                type="text"
                name="gcashNumber"
                value={withdrawalData.gcashNumber}
                onChange={handleWithdrawalChange}
                placeholder="Enter GCash number"
              />
            </div>
            <button className="submit-btn" onClick={handleWithdrawalSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    )}

    {showSuccess && (
      <div className="withdrawal-success-overlay">
        <div className="withdrawal-success-content">
          <svg className="withdrawal-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="withdrawal-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="withdrawal-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h2>Withdrawal Request Successful</h2>
          <p>Wait for 3 days for your refund</p>
        </div>
      </div>
    )}
  </>
  );
};

export default LLNavbar;
