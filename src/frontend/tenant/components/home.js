import React, { useState } from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const Home = ({ onNavigateToBHDetails, onNavigate }) => {
  // 10 samples for each section
  const listings = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Listing ${i + 1}`,
    address: `${100 + i} Main St, City`
  }));
  const pending = Array.from({ length: 10 }, (_, i) => ({
    id: i + 101,
    name: `Pending ${i + 1}`,
    address: `${200 + i} Pending Ave, City`
  }));
  const occupied = Array.from({ length: 10 }, (_, i) => ({
    id: i + 201,
    name: `Occupied ${i + 1}`,
    address: `${300 + i} Occupied Rd, City`
  }));

  const [showAllListings, setShowAllListings] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllOccupied, setShowAllOccupied] = useState(false);

  // Helper to chunk array into rows of 5
  const chunkRows = (arr) => {
    const rows = [];
    for (let i = 0; i < arr.length; i += 5) {
      rows.push(arr.slice(i, i + 5));
    }
    return rows;
  };

  const listingsRows = chunkRows(listings);
  const pendingRows = chunkRows(pending);
  const occupiedRows = chunkRows(occupied);

  return (
    <div className="home-container">
      <Navbar onNavigate={onNavigate} />
      <div className="home-hero">
        <h1 className="home-hero-text">
          <span className="text-gray">Boarding made</span><br />
          <span className="text-gray">easy</span><span className="text-blue">, living</span><br />
          <span className="text-blue">made better</span>
        </h1>

        {/* Listings Section */}
        <p className="home-hero-subtitle">Boarding Houses</p>
        { (showAllListings ? listingsRows : listingsRows.slice(0, 1)).map((row, rowIdx) => (
          <div className="boarding-cards-row" key={rowIdx}>
            {row.map((house) => (
              <div key={house.id} className="boarding-card" onClick={onNavigateToBHDetails}>
                <div className="boarding-card-image"></div>
                <h3 className="boarding-card-name">{house.name}</h3>
                <p className="boarding-card-address">{house.address}</p>
              </div>
            ))}
          </div>
        ))}
        {listings.length > 5 && (
          <button className="see-all-btn" onClick={() => setShowAllListings((v) => !v)}>
            {showAllListings ? 'Show Less' : 'See All'}
          </button>
        )}

        {/* Pending Section */}
        <p className="home-hero-subtitle">Pending</p>
        { (showAllPending ? pendingRows : pendingRows.slice(0, 1)).map((row, rowIdx) => (
          <div className="boarding-cards-row" key={rowIdx}>
            {row.map((house) => (
              <div key={house.id} className="boarding-card" onClick={onNavigateToBHDetails}>
                <div className="boarding-card-image"></div>
                <h3 className="boarding-card-name">{house.name}</h3>
                <p className="boarding-card-address">{house.address}</p>
              </div>
            ))}
          </div>
        ))}
        {pending.length > 5 && (
          <button className="see-all-btn" onClick={() => setShowAllPending((v) => !v)}>
            {showAllPending ? 'Show Less' : 'See All'}
          </button>
        )}

        {/* Occupied Section */}
        <p className="home-hero-subtitle">Occupied</p>
        { (showAllOccupied ? occupiedRows : occupiedRows.slice(0, 1)).map((row, rowIdx) => (
          <div className="boarding-cards-row" key={rowIdx}>
            {row.map((house) => (
              <div key={house.id} className="boarding-card" onClick={onNavigateToBHDetails}>
                <div className="boarding-card-image"></div>
                <h3 className="boarding-card-name">{house.name}</h3>
                <p className="boarding-card-address">{house.address}</p>
              </div>
            ))}
          </div>
        ))}
        {occupied.length > 5 && (
          <button className="see-all-btn" onClick={() => setShowAllOccupied((v) => !v)}>
            {showAllOccupied ? 'Show Less' : 'See All'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
