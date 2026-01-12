import React, { useState } from 'react';
import '../styles/llsettings.css';
import '../styles/llreservations.css';

const LLVerifyModal = ({ show, onClose }) => {
  const [gcashNumber, setGcashNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!show) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle payment verification logic
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-llverify" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Account Verification Payment</h2>
        {/* QR Code Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <img src={require('../../images/300.jpg')} alt="GCash QR Code" style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }} />
          <span style={{ fontSize: 13, color: '#666' }}>Scan this QR code to pay</span>
        </div>
        {submitted ? (
          <div style={{textAlign: 'center', padding: 24}}>
            <h3>Payment Info Submitted!</h3>
            <p>Your payment information has been received. Please wait for admin approval.</p>
            <button className="approve-button" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="payment-info-form">
            <div className="modal-section">
              <h3 className="section-title">Payment Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">GCash Number:</span>
                  <input
                    type="text"
                    className="info-value"
                    value={gcashNumber}
                    onChange={e => setGcashNumber(e.target.value)}
                    placeholder="Enter your GCash number"
                    required
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Amount:</span>
                  <input
                    type="number"
                    className="info-value"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 100)"
                    required
                  />
                </div>
              </div>
              <div style={{marginTop: 16, fontSize: 14, color: '#555'}}>
                Please send the payment to <b>GCash 09123456789</b> and enter your GCash number and amount above. After submitting, wait for admin approval.
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="reject-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="approve-button">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LLVerifyModal;
