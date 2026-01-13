// src/frontend/tenant/components/history.js
// Tenant transaction history component
// This is where all the transactions of the tenant will be recorded, such as reservations, refund requests, and more.
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import '../styles/history.css';
import '../styles/llhistory.css';


import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const History = ({ onNavigate, currentPage, userId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchHistory();
  }, [userId]);

  return (
    <div className="tenant-page transaction-history-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage || "history"} />
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
    </div>
  );
};

export default History;
