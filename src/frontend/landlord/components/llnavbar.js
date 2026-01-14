import React, { useState, useRef, useEffect } from 'react';
import '../styles/llnavbar.css';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const LLNavbar = ({ onNavigate, currentPage, onShowVerifyModal }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    gcashNumber: ''
  });
  const settingsRef = useRef(null);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchBalance = async () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.userId || userData.uid || userData.id || '';
      if (!userId) return;
      // Try users collection first
      let snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) {
        // Try landlords collection
        snap = await getDoc(doc(db, 'landlords', userId));
      }
      if (snap.exists()) {
        const data = snap.data();
        setBalance(parseFloat(data.balance) || 0);
      }
    };
    fetchBalance();
  }, []);

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

  const [withdrawalError, setWithdrawalError] = useState('');
  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      // Only allow numbers less than or equal to balance
      const numValue = parseFloat(value);
      if (numValue > balance) {
        setWithdrawalError('Amount cannot exceed current balance.');
      } else if (numValue < 0) {
        setWithdrawalError('Amount cannot be negative.');
      } else {
        setWithdrawalError('');
      }
    } else if (name === 'gcashNumber') {
      // Only allow 11 digit numbers
      if (!/^\d{0,11}$/.test(value)) {
        return; // Prevent entering more than 11 digits or non-numeric
      }
      if (value.length > 0 && value.length !== 11) {
        setWithdrawalError('GCash number must be exactly 11 digits.');
      } else {
        setWithdrawalError('');
      }
    }
    setWithdrawalData({ ...withdrawalData, [name]: value });
  };

  const handleWithdrawalSubmit = async () => {
    const amount = parseFloat(withdrawalData.amount);
    if (isNaN(amount) || amount > balance || amount < 0) {
      setWithdrawalError('Please enter a valid amount less than or equal to your balance.');
      return;
    }
    if (!withdrawalData.gcashNumber || withdrawalData.gcashNumber.length !== 11) {
      setWithdrawalError('GCash number must be exactly 11 digits.');
      return;
    }
    setWithdrawalError('');
    // Save withdrawal request to Firestore for admin
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      await addDoc(collection(db, 'requests'), {
        label: 'Landlord',
        request: 'Withdrawal Request',
        user: userData.fullName || userData.name || userData.email || userData.userId || 'Unknown',
        userId: userData.userId || userData.uid || userData.id || '',
        amount: amount,
        gcashNumber: withdrawalData.gcashNumber,
        status: 'Pending',
        date: serverTimestamp(),
      });
    } catch (err) {
      setWithdrawalError('Failed to submit withdrawal request. Please try again.');
      return;
    }
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
        <button onClick={() => onNavigate('llhome')} className={`llnavbar-center-link${currentPage === 'llhome' ? ' llnavbar-center-link-active' : ''}`}>Home</button>
        <button onClick={() => onNavigate('llreservations')} className={`llnavbar-center-link${currentPage === 'llreservations' ? ' llnavbar-center-link-active' : ''}`}>Reservations</button>
        <div className="llsettings-dropdown" ref={settingsRef}>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`llnavbar-center-link${currentPage === 'llprofile' ? ' llnavbar-center-link-active' : ''}`}>Settings</button>
          {isSettingsOpen && (
            <div className="llsettings-dropdown-menu">
              <button className="llsettings-dropdown-item" onClick={() => onNavigate('llprofile')}>
                <span>Profile</span>
              </button>
              {(() => {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                if (!(userData.status === 'verified' || userData.isVerified)) {
                  return (
                    <button className="llsettings-dropdown-item" onClick={onShowVerifyModal}>
                      <span>Verify Account</span>
                    </button>
                  );
                  // Only show if not verified
                }
                return null;
              })()}
              <button className="llsettings-dropdown-item" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        <button onClick={() => onNavigate('llhistory')} className={`llnavbar-center-link${currentPage === 'llhistory' ? ' llnavbar-center-link-active' : ''}`}>Transaction History</button>
      </div>

      {/* Landlord status before balance */}
      <div className="llnavbar-status-balance-container" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <span className="llnavbar-status" style={{ color: (() => {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          return userData.status === 'verified' || userData.isVerified ? 'green' : 'red';
        })(), fontWeight: 'bold' }}>
          {(() => {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            return userData.status === 'verified' || userData.isVerified ? 'Verified' : 'Not Verified';
          })()}
        </span>
        <div className="llnavbar-balance" onClick={() => setShowWithdrawalModal(true)}>
          Balance: ₱<span className="balance-amount">{balance.toFixed(2)}</span>
        </div>
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
                min="0"
                max={balance}
              />
              {withdrawalError && (
                <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>{withdrawalError}</div>
              )}
            </div>
            <div className="form-group">
              <label>GCash Number</label>
              <input
                type="text"
                name="gcashNumber"
                value={withdrawalData.gcashNumber}
                onChange={handleWithdrawalChange}
                placeholder="Enter GCash number"
                maxLength="11"
                pattern="\d{11}"
                inputMode="numeric"
              />
              {withdrawalData.gcashNumber && withdrawalData.gcashNumber.length !== 11 && (
                <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>
                  GCash number must be exactly 11 digits.
                </div>
              )}
            </div>
            <button
              className="submit-btn"
              onClick={handleWithdrawalSubmit}
              disabled={
                withdrawalError ||
                !withdrawalData.amount ||
                parseFloat(withdrawalData.amount) > balance ||
                parseFloat(withdrawalData.amount) <= 0 ||
                !withdrawalData.gcashNumber ||
                withdrawalData.gcashNumber.length !== 11
              }
            >
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
