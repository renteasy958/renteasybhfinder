
import React from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const SearchResults = ({ results, onBack, onNavigate }) => {
  const handleCardClick = (id) => {
    if (onNavigate) {
      // Store selected BH id in localStorage for details page
      localStorage.setItem('selectedBHId', id);
      onNavigate('bhdetails');
    }
  };
  return (
    <div className="home-container">
      <Navbar onNavigate={onNavigate} />
      <div className="home-hero">
        <button onClick={() => onNavigate('home')} className="back-btn" style={{ position: 'relative', top: 'auto', left: 'auto', marginBottom: '20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Back</span>
        </button>
        <h2 className="home-hero-text">Search Results</h2>
        {results.length === 0 ? (
          <p>No boarding houses found.</p>
        ) : (
          <div className="boarding-cards-row">
            {results.map((house, idx) => (
              <div key={house.id || idx} className="boarding-card" style={{ textAlign: 'left' }} onClick={() => handleCardClick(house.id)}>
                <div
                  className="boarding-card-image"
                  style={house.images && house.images[0] ? {
                    backgroundImage: `url(${house.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                ></div>
                <h3 className="boarding-card-name" style={{ textAlign: 'left' }}>{house.name}</h3>
                <p className="boarding-card-address" style={{ textAlign: 'left' }}>
                  {house.sitio ? house.sitio + ', ' : ''}
                  {house.barangay ? house.barangay + ', ' : ''}
                  {house.municipality ? house.municipality + ', ' : ''}
                  {house.province ? house.province : ''}
                </p>
                <p className="boarding-card-price" style={{ textAlign: 'left' }}>{house.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
