import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Verification from './components/Verification';
import PendingApproval from './components/PendingApproval';
import TransactionHistory from './components/TransactionHistory';
import Landlords from './components/Landlords';
import Tenants from './components/Tenants';
import BoardingHouses from './components/BoardingHouses';
import Requests from './components/Requests';
import './styles/sidebar.css';
import './styles/admin.css';

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
      case 'requests':
        return <Requests />;
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
