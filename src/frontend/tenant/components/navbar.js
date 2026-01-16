import React, { useState, useRef, useEffect } from 'react';
import '../styles/navbar.css';
import { auth } from '../../../firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = ({ onNavigate, onSettingsClick, onSearch, onSearchResults, listings = [], currentPage }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    type: '',
    location: '',
    price: ''
  });
  const [pendingFilter, setPendingFilter] = useState({
    type: '',
    location: '',
    price: ''
  });
  const settingsRef = useRef(null);
  const filterRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userData');
      localStorage.removeItem('currentPage');
      // Removed likedBoardingHouses logic
      onNavigate('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [searchValue, setSearchValue] = useState('');

  const applyFilter = () => {
    const safeQuery = typeof searchValue === 'string' ? searchValue.toLowerCase() : '';
    
    // First filter by search query
    let results = listings.filter(house =>
      (house.name && house.name.toLowerCase().includes(safeQuery)) ||
      (house.address && house.address.toLowerCase().includes(safeQuery)) ||
      (house.sitio && house.sitio.toLowerCase().includes(safeQuery)) ||
      (house.barangay && house.barangay.toLowerCase().includes(safeQuery)) ||
      (house.municipality && house.municipality.toLowerCase().includes(safeQuery)) ||
      (house.province && house.province.toLowerCase().includes(safeQuery))
    );

    // Then apply additional filters
    if (pendingFilter.type) {
      results = results.filter(house => house.type === pendingFilter.type);
    }

    if (pendingFilter.location) {
      results = results.filter(house => house.barangay === pendingFilter.location);
    }

    if (pendingFilter.price) {
      results = results.filter(house => {
        const price = parseInt(house.price?.replace(/[^0-9]/g, '') || '0');
        if (pendingFilter.price === '500-1000') return price >= 500 && price <= 1000;
        if (pendingFilter.price === '1001-2500') return price >= 1001 && price <= 2500;
        if (pendingFilter.price === '2501-up') return price >= 2501;
        return true;
      });
    }

    setFilter(pendingFilter);
    setIsFilterOpen(false);
    if (onSearchResults) onSearchResults(results);
    if (onNavigate) onNavigate('searchresults');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <img src={require('../../images/logo.png')} alt="RentEasy Logo" />
      </div>
      <div className="navbar-search" style={{ position: 'relative' }}>
        <form
          onSubmit={e => {
            e.preventDefault();
            const query = (searchValue || '').toLowerCase();
            
            // Filter listings by search query
            const results = listings.filter(house =>
              (house.name && house.name.toLowerCase().includes(query)) ||
              (house.address && house.address.toLowerCase().includes(query)) ||
              (house.sitio && house.sitio.toLowerCase().includes(query)) ||
              (house.barangay && house.barangay.toLowerCase().includes(query)) ||
              (house.municipality && house.municipality.toLowerCase().includes(query)) ||
              (house.province && house.province.toLowerCase().includes(query))
            );
            
            // Pass results and navigate
            if (onSearchResults) onSearchResults(results);
            if (onNavigate) onNavigate('searchresults');
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <input
            type="text"
            placeholder="Search boarding houses..."
            className="navbar-search-input"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" style={{ display: 'none' }}></button>
        </form>
        <button className="navbar-filter-btn" onClick={() => {
          setPendingFilter(filter);
          setIsFilterOpen((open) => !open);
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="8" cy="6" r="2"/>
            <circle cx="16" cy="12" r="2"/>
            <circle cx="12" cy="18" r="2"/>
          </svg>
        </button>
        {isFilterOpen && (
          <div className="navbar-filter-dropdown" ref={filterRef} style={{
            position: 'absolute',
            top: '40px',
            left: 'auto',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10,
            padding: '10px',
            minWidth: '340px',
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            <div style={{ marginBottom: '0px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '12px' }}>Type:</label>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Bed spacer','Single Room','Shared Room (2-4 pax)','Shared Room (5-8 pax)','Apartment Type','Family'].map(option => (
                  <li key={option} style={{ marginBottom: '2px' }}>
                    <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="radio"
                        name="filter-type"
                        value={option}
                        checked={pendingFilter.type === option}
                        onChange={() => setPendingFilter(f => ({ ...f, type: option }))}
                        style={{ marginRight: '4px' }}
                      />
                      {option}
                    </label>
                  </li>
                ))}
                <li style={{ marginBottom: '2px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="filter-type"
                      value=""
                      checked={pendingFilter.type === ''}
                      onChange={() => setPendingFilter(f => ({ ...f, type: '' }))}
                      style={{ marginRight: '4px' }}
                    />
                    Any
                  </label>
                </li>
              </ul>
            </div>
            <div style={{ marginBottom: '0px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '12px' }}>Location:</label>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Barangay 1','Barangay 2','Barangay 3','Barangay 4','Barangay 5','Barangay 6','Barangay 7','Barangay 8','Barangay 9'].map(option => (
                  <li key={option} style={{ marginBottom: '2px' }}>
                    <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="radio"
                        name="filter-location"
                        value={option}
                        checked={pendingFilter.location === option}
                        onChange={() => setPendingFilter(f => ({ ...f, location: option }))}
                        style={{ marginRight: '4px' }}
                      />
                      {option}
                    </label>
                  </li>
                ))}
                <li style={{ marginBottom: '2px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="filter-location"
                      value=""
                      checked={pendingFilter.location === ''}
                      onChange={() => setPendingFilter(f => ({ ...f, location: '' }))}
                      style={{ marginRight: '4px' }}
                    />
                    Any
                  </label>
                </li>
              </ul>
            </div>
            <div style={{ marginBottom: '0px', gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', fontSize: '12px' }}>Price:</label>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '12px' }}>
                {['500-1000','1001-2500','2501-up'].map(option => (
                  <li key={option} style={{ marginBottom: '0px' }}>
                    <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                      <input
                        type="radio"
                        name="filter-price"
                        value={option}
                        checked={pendingFilter.price === option}
                        onChange={() => setPendingFilter(f => ({ ...f, price: option }))}
                        style={{ marginRight: '4px' }}
                      />
                      {option}
                    </label>
                  </li>
                ))}
                <li style={{ marginBottom: '0px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="filter-price"
                      value=""
                      checked={pendingFilter.price === ''}
                      onChange={() => setPendingFilter(f => ({ ...f, price: '' }))}
                      style={{ marginRight: '4px' }}
                    />
                    Any
                  </label>
                </li>
              </ul>
            </div>
            <button
              style={{ width: '100%', padding: '6px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', gridColumn: '1 / -1' }}
              onClick={e => {
                e.preventDefault();
                applyFilter();
              }}
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      <div className="navbar-links">
        <button onClick={() => onNavigate('home')} className={`navbar-link${currentPage === 'home' ? ' navbar-link-active' : ''}`}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="navbar-link-text">Home</span>
        </button>
        <button onClick={() => onNavigate('liked')} className={`navbar-link${currentPage === 'liked' ? ' navbar-link-active' : ''}`}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span className="navbar-link-text">Liked</span>
        </button>
        <div className="settings-dropdown" ref={settingsRef}>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`navbar-link${currentPage === 'profile' ? ' navbar-link-active' : ''}`}> 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m6-12l-4.24 4.24M10.24 13.76L6 18m12-12l-4.24 4.24M10.24 10.24L6 6"></path>
            </svg>
            <span className="navbar-link-text">Settings</span>
          </button>
          {isSettingsOpen && (
            <div className="settings-dropdown-menu">
              <button className="settings-dropdown-item" onClick={() => onNavigate('profile')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </button>
              <button className="settings-dropdown-item" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
        <button onClick={() => onNavigate('history')} className={`navbar-link${currentPage === 'history' ? ' navbar-link-active' : ''}`}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="navbar-link-text">History</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
