import React from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const Home = ({ onNavigateToBHDetails, onNavigate }) => {
  const boardingHouses = [
    { id: 1, name: 'Sunrise Residence', address: '123 Main Street, City' },
    { id: 2, name: 'Ocean View Inn', address: '456 Beach Road, City' },
    { id: 3, name: 'Mountain Lodge', address: '789 Hill Avenue, City' },
    { id: 4, name: 'City Center House', address: '321 Downtown Blvd, City' },
    { id: 5, name: 'Garden Apartments', address: '654 Park Lane, City' },
    { id: 6, name: 'Riverside Place', address: '987 River Drive, City' },
    { id: 7, name: 'Sunset Villa', address: '234 Sunset Blvd, City' },
    { id: 8, name: 'Lakeside Manor', address: '567 Lake View Dr, City' },
    { id: 9, name: 'Forest Haven', address: '890 Forest Road, City' },
    { id: 10, name: 'Urban Nest', address: '432 Urban Street, City' },
    { id: 11, name: 'Meadow House', address: '765 Meadow Lane, City' },
    { id: 12, name: 'Peaceful Pines', address: '198 Pine Avenue, City' }
  ];

  return (
    <div className="home-container">
      <Navbar onNavigate={onNavigate} />
      <div className="home-hero">
        <h1 className="home-hero-text">
          <span className="text-gray">Boarding made</span><br />
          <span className="text-gray">easy</span><span className="text-blue">, living</span><br />
          <span className="text-blue">made better</span>
        </h1>
        <p className="home-hero-subtitle">Boarding Houses</p>
        
        <div className="boarding-cards-container">
          {boardingHouses.map((house) => (
            <div key={house.id} className="boarding-card" onClick={onNavigateToBHDetails}>
              <div className="boarding-card-image"></div>
              <h3 className="boarding-card-name">{house.name}</h3>
              <p className="boarding-card-address">{house.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
