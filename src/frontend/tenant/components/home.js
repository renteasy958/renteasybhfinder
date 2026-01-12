import React, { useState } from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const Home = ({ onNavigateToBHDetails, onNavigate, onSearchResults }) => {
  // 10 samples for Boarding Houses only
  const listings = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Listing ${i + 1}`,
    address: `${100 + i} Main St, City`
  }));

  // Helper to chunk array into rows of 6
  const chunkRows = (arr) => {
    const rows = [];
    for (let i = 0; i < arr.length; i += 6) {
      rows.push(arr.slice(i, i + 6));
    }
    return rows;
  };

  const listingsRows = chunkRows(listings);

  return (
    <div className="home-container">
      <Navbar
        onNavigate={onNavigate}
        onSearch={query => {
          // Simple search: filter by name or address
          const results = listings.filter(house =>
            house.name.toLowerCase().includes(query.toLowerCase()) ||
            house.address.toLowerCase().includes(query.toLowerCase())
          );
          onSearchResults(results);
        }}
        currentPage="home"
      />
      <div className="home-hero">
        <h1 className="home-hero-text">
          <span className="text-gray">Boarding made</span><br />
          <span className="text-gray">easy</span><span className="text-blue">, living</span><br />
          <span className="text-blue">made better</span>
        </h1>

        {/* Listings Section */}
        <p className="home-hero-subtitle">Boarding Houses</p>
        {listingsRows.map((row, rowIdx) => (
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
      </div>
    </div>
  );
};

export default Home;
