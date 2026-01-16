import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const Home = ({ onNavigateToBHDetails, onNavigate, onSearchResults }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { db } = await import('../../../firebase/config');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const q = query(collection(db, 'boardingHouses'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const houses = [];
        querySnapshot.forEach((doc) => {
          houses.push({ id: doc.id, ...doc.data() });
        });
        setListings(houses);
      } catch (error) {
        console.error('Error fetching approved boarding houses:', error);
      }
    };
    fetchListings();
  }, []);

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
        listings={listings}
        onSearch={query => {
          // Ensure query is a string before using toLowerCase
          const safeQuery = typeof query === 'string' ? query.toLowerCase() : '';
          const results = listings.filter(house =>
            (house.name && house.name.toLowerCase().includes(safeQuery)) ||
            (house.address && house.address.toLowerCase().includes(safeQuery)) ||
            (house.sitio && house.sitio.toLowerCase().includes(safeQuery)) ||
            (house.barangay && house.barangay.toLowerCase().includes(safeQuery)) ||
            (house.municipality && house.municipality.toLowerCase().includes(safeQuery)) ||
            (house.province && house.province.toLowerCase().includes(safeQuery))
          );
          onSearchResults(results);
        }}
        onSearchResults={onSearchResults}
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
              <div key={house.id} className="boarding-card" onClick={() => onNavigateToBHDetails(house.id)}>
                <div
                  className="boarding-card-image"
                  style={house.images && house.images[0] ? {
                    backgroundImage: `url(${house.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                ></div>
                <h3 className="boarding-card-name">{house.name}</h3>
                <p className="boarding-card-address">
                  {house.sitio ? house.sitio + ', ' : ''}
                  {house.barangay ? house.barangay + ', ' : ''}
                  {house.municipality ? house.municipality + ', ' : ''}
                  {house.province ? house.province : ''}
                </p>
                <p className="boarding-card-price">{house.price}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
