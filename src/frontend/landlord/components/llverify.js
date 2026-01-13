import React, { useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import '../styles/llverify.css';

const LLVerify = ({ show, onClose }) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  if (!show) return null;

  const handleSubmit = async () => {
    if (!referenceNumber.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'verificationRequests'), {
        name: `${userData.firstName || ''} ${userData.middleName || ''} ${userData.surname || ''}`.trim(),
        date: new Date().toLocaleString(),
        referenceNumber: referenceNumber.trim(),
        userId: userData.uid || userData.userId || '',
      });
      // Add to local history for demo
      const history = JSON.parse(localStorage.getItem('llHistory') || '[]');
      history.unshift({
        id: Date.now(),
        type: 'Verification',
        date: new Date().toLocaleString(),
        status: 'Pending',
        referenceNumber: referenceNumber.trim(),
      });
      localStorage.setItem('llHistory', JSON.stringify(history));
      setReferenceNumber('');
      setSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setSubmitting(false);
      alert('Failed to submit verification request.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        {showSuccess ? (
          <div className="success-modal" style={{textAlign:'center',padding:'40px 20px'}}>
            <div className="success-checkmark">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <p className="success-text" style={{fontWeight:'bold',fontSize:'18px',marginTop:'16px'}}>Successful!</p>
            <p style={{marginTop:'8px'}}>Please wait for the approval.</p>
          </div>
        ) : (
        <>
        <button className="modal-close-x" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 className="modal-title">ACCOUNT VERIFICATION PAYMENT</h2>
        <p className="verification-notice" style={{ color: '#000', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
          Notice: You will pay <span style={{ color: '#000' }}>₱300</span> to verify your account.
        </p>
        <div className="payment-content">
          <div className="qr-section">
            <img src={require('../../images/300.jpg')} alt="QR Code" className="qr-code" />
            <div className="gcash-label">GCash</div>
          </div>
          <div className="payment-details">
            <h3 className="payment-name">RENT EASY</h3>
            <p className="payment-account">Account Number: 09123456789</p>
            <div className="reference-input-group">
              <label className="reference-label">Reference Number</label>
              <input 
                type="text" 
                className="reference-input" 
                placeholder="Enter reference number"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                disabled={submitting}
              />
            </div>
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={!referenceNumber.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default LLVerify;
