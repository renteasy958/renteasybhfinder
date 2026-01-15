// src/frontend/tenant/components/history.js
// Tenant transaction history component
// This is where all the transactions of the tenant will be recorded, such as reservations, refund requests, and more.
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import '../styles/history.css';
import '../styles/llhistory.css';


import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const History = ({ onNavigate, currentPage, userId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // Fetch reservations
        const reservationsQuery = query(collection(db, 'reservations'), where('tenantId', '==', userId));
        const reservationsSnapshot = await getDocs(reservationsQuery);
        const reservationsData = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'Reservation',
          displayType: 'Reservation'
        }));

        // Fetch refund requests
        const refundsQuery = query(collection(db, 'requests'), 
          where('userId', '==', userId), 
          where('request', '==', 'Refund')
        );
        const refundsSnapshot = await getDocs(refundsQuery);
        const refundsData = refundsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'Refund Request',
          displayType: 'Refund',
          price: doc.data().amount,
          date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
        }));

        // Combine and sort by date
        const combinedData = [...reservationsData, ...refundsData].sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        });

        setHistoryData(combinedData);
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistoryData([]);
      }
      setLoading(false);
    };

    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.balance || 0);
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchHistory();
    fetchUserData();
  }, [userId]);

  const handleRequestRefund = () => {
    if (balance <= 0) return;
    setShowRefundModal(true);
  };

  const handleSubmitRefund = async () => {
    const amount = parseFloat(refundAmount);
    if (!userData || isNaN(amount) || amount <= 0 || amount > balance) return;
    try {
      await addDoc(collection(db, 'requests'), {
        label: 'Tenant',
        request: 'Refund',
        status: 'Pending',
        tenantName: `${userData.firstName} ${userData.surname}`,
        amount: amount,
        gcashNumber: gcashNumber,
        date: new Date(),
        userId: userId,
      });
      setShowRefundModal(false);
      setRefundAmount('');
      setGcashNumber('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Failed to submit refund request');
    }
  };

  const closeRefundModal = () => {
    setShowRefundModal(false);
    setRefundAmount('');
    setGcashNumber('');
  };

  return (
    <div className="tenant-page transaction-history-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage || "history"} />
      <div className="balance-section">
        <h3>Current Balance: ₱{balance}</h3>
        <button onClick={handleRequestRefund} disabled={balance <= 0}>Request Refund</button>
      </div>
      <div className="tenant-cards-list">
        {loading ? (
          <div>Loading...</div>
        ) : historyData.length === 0 ? (
          <div>No reservation history found.</div>
        ) : (
          historyData.map((item) => (
            <div key={item.id} className="tenant-card">
              <span className="tenant-card-title">{item.displayType || item.type || 'Transaction'}</span>
              <span className="tenant-card-date">{item.date?.toDate ? item.date.toDate().toLocaleDateString() : new Date(item.date).toLocaleDateString()}</span>
              <span className="tenant-card-amount">₱{item.price || item.amount || 50}</span>
              <span className={item.status === 'Pending' ? 'tenant-card-status pending' : item.status === 'Completed' ? 'tenant-card-status completed' : 'tenant-card-status rejected'}>
                {item.status}
                {item.refNumber && item.status === 'Completed' && (
                  <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
                    Ref: {item.refNumber}
                  </div>
                )}
              </span>
            </div>
          ))
        )}
      </div>

      {showRefundModal && (
        <div className="modal-overlay" onClick={closeRefundModal}>
          <div className="withdrawal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeRefundModal}>
              ×
            </button>
            <h3>Request Refund</h3>
            <div className="withdrawal-form">
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  max={balance}
                />
                {refundAmount && parseFloat(refundAmount) > balance && (
                  <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>
                    Amount cannot exceed current balance.
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>GCash Number</label>
                <input
                  type="text"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value)}
                  placeholder="Enter GCash number"
                  maxLength="11"
                  pattern="\d{11}"
                  inputMode="numeric"
                />
                {gcashNumber && gcashNumber.length !== 11 && (
                  <div style={{ color: 'red', fontSize: '0.9em', marginTop: '4px' }}>
                    GCash number must be exactly 11 digits.
                  </div>
                )}
              </div>
              <button
                className="submit-btn"
                onClick={handleSubmitRefund}
                disabled={
                  !refundAmount ||
                  parseFloat(refundAmount) > balance ||
                  parseFloat(refundAmount) <= 0 ||
                  !gcashNumber ||
                  gcashNumber.length !== 11
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
            <h2>Refund Request Successful</h2>
            <p>Wait for 3 days for your refund</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
