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

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'reservations'), where('tenantId', '==', userId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching reservation history:', error);
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
      alert('Refund request submitted successfully');
      setShowRefundModal(false);
      setRefundAmount('');
      setGcashNumber('');
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
              <span className="tenant-card-title">{item.type || 'Reservation'}</span>
              <span className="tenant-card-date">{item.date}</span>
              <span className="tenant-card-amount">₱{item.price || 50}</span>
              <span className={item.status === 'Pending' ? 'tenant-card-status pending' : 'tenant-card-status completed'}>{item.status}</span>
            </div>
          ))
        )}
      </div>

      {showRefundModal && (
        <div className="modal-overlay" onClick={closeRefundModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request Refund</h2>
            <div style={{ marginBottom: '16px' }}>
              <label>Amount (Max: ₱{balance}):</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter amount"
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label>GCash Number:</label>
              <input
                type="text"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value)}
                placeholder="Enter GCash number"
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={closeRefundModal} style={{ background: '#ccc' }}>Cancel</button>
              <button
                onClick={handleSubmitRefund}
                disabled={!refundAmount || parseFloat(refundAmount) > balance || parseFloat(refundAmount) <= 0}
                style={{ background: parseFloat(refundAmount) > balance || parseFloat(refundAmount) <= 0 ? '#ccc' : '#22c55e', color: '#fff' }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
