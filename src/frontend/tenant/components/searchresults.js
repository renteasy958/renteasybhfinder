
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
      <button onClick={onBack} style={{ position: 'absolute', top: 90, left: 20, zIndex: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
        ← Back
      </button>
      <div className="home-hero">
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
