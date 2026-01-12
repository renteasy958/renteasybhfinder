// src/frontend/tenant/components/history.js
// Tenant transaction history component
// This is where all the transactions of the tenant will be recorded, such as reservations, refund requests, and more.
import React from 'react';
import Navbar from './navbar';
import '../styles/history.css';
import '../styles/llhistory.css';


const historyData = [
  { id: 1, transaction: 'Reservation', date: '2025-12-01', amount: '₱1,200.00', status: 'Completed' },
  { id: 2, transaction: 'Refund', date: '2025-12-10', amount: '₱500.00', status: 'Pending' },
  { id: 3, transaction: 'Reservation', date: '2025-12-20', amount: '₱1,500.00', status: 'Pending' },
];

const History = ({ onNavigate, currentPage }) => {
  return (
    <div className="tenant-page transaction-history-page">
      <Navbar onNavigate={onNavigate} currentPage={currentPage || "history"} />
      <div className="tenant-cards-list">
        {historyData.map((item) => (
          <div key={item.id} className="tenant-card">
            <span className="tenant-card-title">{item.transaction}</span>
            <span className="tenant-card-date">{item.date}</span>
            {item.amount && <span className="tenant-card-amount">{item.amount}</span>}
            <span className={item.status === 'Pending' ? 'tenant-card-status pending' : 'tenant-card-status completed'}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
