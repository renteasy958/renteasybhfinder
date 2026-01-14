import React from 'react';
import '../styles/liked.css';
import Navbar from './navbar';

const Liked = ({ onNavigate, searchQuery = '' }) => {
  const likedBoardingHouses = JSON.parse(localStorage.getItem('likedBoardingHouses') || '[]');

  // Filter liked boarding houses by search query (name or address)
  const safeLower = val => (typeof val === 'string' ? val.toLowerCase() : '');
  const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
  const filteredHouses = likedBoardingHouses.filter(house => {
    return (
      safeLower(house.name).includes(query) ||
      safeLower(house.address).includes(query) ||
      safeLower(house.sitio).includes(query) ||
      safeLower(house.barangay).includes(query) ||
      safeLower(house.municipality).includes(query) ||
      safeLower(house.province).includes(query)
    );
  });

  return (
    <div className="liked-container">
      <Navbar onNavigate={onNavigate} />
      <div className="liked-content">
        <h1 className="liked-title">Favorites</h1>
        {filteredHouses.length === 0 ? (
          <p className="liked-empty">No liked boarding houses found.</p>
        ) : (
          <div className="liked-cards-container">
            {filteredHouses.map((house, index) => (
              <div key={house.id || index} className="boarding-card" onClick={() => onNavigate('bhdetails')} style={{ textAlign: 'left' }}>
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

export default Liked;
