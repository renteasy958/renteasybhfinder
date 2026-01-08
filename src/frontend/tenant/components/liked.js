import React from 'react';
import '../styles/liked.css';
import Navbar from './navbar';

const Liked = ({ onNavigate }) => {
  // Get liked boarding houses from localStorage
  const likedBoardingHouses = JSON.parse(localStorage.getItem('likedBoardingHouses') || '[]');

  return (
    <div className="liked-container">
      <Navbar onNavigate={onNavigate} />
      <div className="liked-content">
        <h1 className="liked-title">Favorites</h1>
        
        {likedBoardingHouses.length === 0 ? (
          <p className="liked-empty">No liked boarding houses yet.</p>
        ) : (
          <div className="liked-cards-container">
            {likedBoardingHouses.map((bh, index) => (
              <div key={index} className="liked-card" onClick={() => onNavigate('bhdetails')}>
                <div className="liked-card-image"></div>
                <h3 className="liked-card-name">{bh.name}</h3>
                <p className="liked-card-address">{bh.address}</p>
                <p className="liked-card-price">{bh.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;
