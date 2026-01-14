import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Verification from './Verification';
import PendingApproval from './PendingApproval';
import TransactionHistory from './TransactionHistory';
import Landlords from './Landlords';
import Tenants from './Tenants';
import BoardingHouses from './BoardingHouses';
import '../styles/sidebar.css';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [selected, setSelected] = useState('verification');

  const renderPage = () => {
    switch (selected) {
      case 'verification':
        return <Verification />;
      case 'pending':
        return <PendingApproval />;
      case 'transactions':
        return <TransactionHistory />;
      case 'landlords':
        return <Landlords />;
      case 'tenants':
        return <Tenants />;
      case 'boardinghouses':
        return <BoardingHouses />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar onSelect={setSelected} selected={selected} />
      <div className="admin-content">
        {renderPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;
