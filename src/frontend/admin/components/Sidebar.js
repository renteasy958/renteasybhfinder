import React from 'react';
import '../styles/sidebar.css';
import logo from '../../images/logo.png';

const Sidebar = ({ onSelect, selected }) => {
  const menu = [
    { key: 'verification', label: 'Verification' },
    { key: 'pending', label: 'Pending Approval' },
    { key: 'requests', label: 'Requests' },
    { key: 'transactions', label: 'Transaction History' },
    { key: 'landlords', label: 'Landlords' },
    { key: 'tenants', label: 'Tenants' },
    { key: 'boardinghouses', label: 'Boarding Houses' },
  ];
  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        {menu.map(item => (
          <li
            key={item.key}
            className={selected === item.key ? 'active' : ''}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
