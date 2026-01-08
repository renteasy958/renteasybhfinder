import React, { useState } from 'react';
import '../styles/bhdetails.css';
import Navbar from './navbar';

const BHDetails = ({ onNavigateBack, onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const boardingHouse = {
    name: 'Sunrise Residence',
    address: '123 Main Street, City',
    price: '₱5,000/month'
  };
  
  // Check if this boarding house is already liked
  const likedBoardingHouses = JSON.parse(localStorage.getItem('likedBoardingHouses') || '[]');
  const [isLiked, setIsLiked] = useState(
    likedBoardingHouses.some(bh => bh.name === boardingHouse.name)
  );
  
  const images = [
    'Image 1',
    'Image 2',
    'Image 3',
    'Image 4',
    'Image 5'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleLike = () => {
    const likedBoardingHouses = JSON.parse(localStorage.getItem('likedBoardingHouses') || '[]');
    
    if (isLiked) {
      // Remove from liked
      const updated = likedBoardingHouses.filter(bh => bh.name !== boardingHouse.name);
      localStorage.setItem('likedBoardingHouses', JSON.stringify(updated));
      setIsLiked(false);
    } else {
      // Add to liked
      likedBoardingHouses.push(boardingHouse);
      localStorage.setItem('likedBoardingHouses', JSON.stringify(likedBoardingHouses));
      setIsLiked(true);
    }
  };

  return (
    <div className="bhdetails-container">
      <Navbar onNavigate={onNavigate} />
      <div className="bhdetails-wrapper">
        <div className="bhdetails-left">
          <div className="carousel-container">
            <button className="back-btn" onClick={onNavigateBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back</span>
            </button>
            
            <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="carousel-image">
              <span className="carousel-placeholder">{images[currentImageIndex]}</span>
            </div>
            
            <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <div className="carousel-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="bh-name-container">
            <div className="bh-name-header">
              <h1 className="bh-name">
                Sunrise Residence
                <button className="heart-btn" onClick={toggleLike}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? "#012e6a" : "none"} stroke="#012e6a" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </h1>
              <div className="rooms-left">
                <span className="rooms-left-number">5</span>
                <span className="rooms-left-text">rooms left</span>
              </div>
            </div>
            <p className="bh-address">123 Main Street, City</p>
            <p className="bh-price">₱5,000/month</p>
          </div>
          
          <div className="map-container">
            <div className="map-placeholder">Map View</div>
          </div>
          
          <div className="landlord-info-container">
            <h2 className="landlord-info-title">Landlord's Contact Information</h2>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Full Name:</span>
              <span className="landlord-info-value">Juan Dela Cruz</span>
            </div>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Contact Number:</span>
              <span className="landlord-info-value">+63 912 345 6789</span>
            </div>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Address:</span>
              <span className="landlord-info-value">456 Landlord Street, City, Province</span>
            </div>
          </div>
        </div>
        <div className="bhdetails-right">
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">
              A comfortable and affordable boarding house located in a convenient area. 
              Features include 24/7 security, Wi-Fi access, common kitchen, and laundry area. 
              Close to schools, malls, and public transportation.
            </p>
          </div>
          
          <div className="inclusions-section">
            <h3 className="inclusions-title">Inclusions</h3>
            <ul className="inclusions-list">
              <li>Toilet</li>
              <li>Chair</li>
              <li>Bed</li>
            </ul>
          </div>
          
          <div className="exclusions-section">
            <h3 className="exclusions-title">Exclusions</h3>
            <ul className="exclusions-list">
              <li>Laundry</li>
              <li>Electricity</li>
              <li>Water</li>
            </ul>
          </div>
          
          <button className="reserve-btn">Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default BHDetails;
