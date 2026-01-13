import React, { useState } from 'react';
import '../styles/llverify.css';

const LLVerify = ({ show, onClose }) => {
  const [referenceNumber, setReferenceNumber] = useState('');

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
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
              />
            </div>
            <button 
              className="submit-btn" 
              onClick={onClose}
              disabled={!referenceNumber.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLVerify;
