import React, { useState } from 'react';
import LLNavbar from './llnavbar';
import LLVerify from './llverify';
import '../styles/llhistory.css';
import '../../admin/styles/transactionhistory.css';

const LLHistory = ({ onNavigate }) => {
  const [historyData] = useState([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
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

  const filteredHistory = historyData.filter(item => item.type === 'Verification' || item.type === 'Withdrawal');
  return (
    <div className="admin-page transaction-history-page">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
      <LLVerify show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="admin-cards-list">
        {filteredHistory.length === 0 ? (
          <div className="no-history">
            <p>No history found</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="admin-card">
              <span className="admin-card-title">{item.type}</span>
              <span className="admin-card-type">{item.tenantName || item.bhName || item.gcashNumber || '-'}</span>
              <span className="admin-card-date">{item.date}</span>
              {item.amount && <span className="admin-card-amount">₱{item.amount}</span>}
              <span className={
                item.status === 'Pending' ? 'admin-card-status pending' :
                item.status === 'Rejected' ? 'admin-card-status rejected' :
                'admin-card-status completed'
              }>{item.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LLHistory;
