import React, { useState } from 'react';
import LLNavbar from './llnavbar';
import '../styles/llhistory.css';

const LLHistory = ({ onNavigate }) => {
  const [historyData] = useState([
    {
      id: 1,
      type: 'Reservation',
      bhName: 'Sample Boarding House 1',
      tenantName: 'John Doe',
      amount: '5000',
      status: 'Approved',
      date: '2026-01-05'
    },
    {
      id: 2,
      type: 'Withdrawal',
      amount: '10000',
      gcashNumber: '09123456789',
      status: 'Completed',
      date: '2026-01-03'
    },
    {
      id: 3,
      type: 'Listing',
      bhName: 'Sample Boarding House 2',
      status: 'Rejected',
      date: '2026-01-01'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return '#10b981';
      case 'Rejected':
        return '#ef4444';
      case 'Pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Reservation':
        return '📅';
      case 'Withdrawal':
        return '💰';
      case 'Listing':
        return '🏠';
      default:
        return '📋';
    }
  };

  return (
    <div className="llhistory-container">
      <LLNavbar onNavigate={onNavigate} />
      <div className="llhistory-content">
        <h1>History</h1>
        <p>View all your past transactions and activities</p>

        <div className="history-list">
          {historyData.length === 0 ? (
            <div className="no-history">
              <p>No history found</p>
            </div>
          ) : (
            <div className="history-box">
              {historyData.map((item) => (
                <div key={item.id} className="history-card">
                  <div className="history-icon">{getTypeIcon(item.type)}</div>
                  <div className="history-details">
                    <div className="history-type">{item.type}</div>
                    {item.bhName && (
                      <div className="history-info">Boarding House: {item.bhName}</div>
                    )}
                    {item.tenantName && (
                      <div className="history-info">Tenant: {item.tenantName}</div>
                    )}
                    {item.gcashNumber && (
                      <div className="history-info">GCash: {item.gcashNumber}</div>
                    )}
                    {item.amount && (
                      <div className="history-amount">Amount: ₱{item.amount}</div>
                    )}
                    <div className="history-date">{new Date(item.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                  <div 
                    className="history-status" 
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  >
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLHistory;
