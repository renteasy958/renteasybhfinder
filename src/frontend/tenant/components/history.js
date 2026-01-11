// src/frontend/tenant/components/history.js
// Tenant transaction history component
// This is where all the transactions of the tenant will be recorded, such as reservations, refund requests, and more.
import React from 'react';
import Navbar from './navbar';
import '../styles/history.css';
import '../styles/llhistory.css';


const History = ({ onNavigate }) => {
  const historyData = [
    { id: 1, action: 'Reservation', date: '2025-12-01', status: 'Completed' },
    { id: 2, action: 'Viewed', date: '2025-11-15', status: 'Completed' },
    { id: 3, action: 'Request Refund', date: '2025-12-10', status: 'Pending' },
    { id: 4, action: 'Reservation', date: '2025-12-20', status: 'Pending' },
  ];

  return (
    <div className="llreservations-container">
      <Navbar onNavigate={onNavigate} />
      <div className="llreservations-content">
        <div className="reservations-list">
          {historyData.map((item) => (
            <div key={item.id} className="reservation-card" style={{paddingTop: '18px', paddingBottom: '18px'}}>
              <span style={{ fontWeight: 600, color: '#2563eb', fontSize: '16px', marginRight: 24, minWidth: 120, display: 'inline-block' }}>{item.action}</span>
              <span style={{ color: '#6b7280', fontSize: '15px', marginRight: 24, minWidth: 110, display: 'inline-block' }}>{item.date}</span>
              <span style={{ color: item.status === 'Pending' ? '#ef4444' : '#22c55e', fontWeight: 600, fontSize: '15px', minWidth: 100, display: 'inline-block' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
