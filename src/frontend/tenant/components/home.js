import React, { useState } from 'react';
import '../styles/home.css';
import Navbar from './navbar';

const Home = ({ onNavigateToBHDetails, onNavigate }) => {
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
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Sunrise Residence</h3>
            <p className="boarding-card-address">123 Main Street, City</p>
          </div>
          
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Ocean View Inn</h3>
            <p className="boarding-card-address">456 Beach Road, City</p>
          </div>
          
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Mountain Lodge</h3>
            <p className="boarding-card-address">789 Hill Avenue, City</p>
          </div>
          
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">City Center House</h3>
            <p className="boarding-card-address">321 Downtown Blvd, City</p>
          </div>
          
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Garden Apartments</h3>
            <p className="boarding-card-address">654 Park Lane, City</p>
          </div>
          
          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Riverside Place</h3>
            <p className="boarding-card-address">987 River Drive, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Sunset Villa</h3>
            <p className="boarding-card-address">234 Sunset Blvd, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Lakeside Manor</h3>
            <p className="boarding-card-address">567 Lake View Dr, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Forest Haven</h3>
            <p className="boarding-card-address">890 Forest Road, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Urban Nest</h3>
            <p className="boarding-card-address">432 Urban Street, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Meadow House</h3>
            <p className="boarding-card-address">765 Meadow Lane, City</p>
          </div>

          <div className="boarding-card" onClick={onNavigateToBHDetails}>
            <div className="boarding-card-image"></div>
            <h3 className="boarding-card-name">Peaceful Pines</h3>
            <p className="boarding-card-address">198 Pine Avenue, City</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
