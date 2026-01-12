
import React from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const SearchResults = ({ results, onBack, onNavigate }) => {
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
          <div>
            {results.map((house, idx) => (
              <div key={house.id || idx} className="boarding-card">
                <div className="boarding-card-image"></div>
                <h3 className="boarding-card-name">{house.name}</h3>
                <p className="boarding-card-address">{house.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
