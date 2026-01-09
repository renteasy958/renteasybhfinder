import React, { useState } from 'react';
import '../styles/llhome.css';
import LLNavbar from './llnavbar';

const LLHome = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBH, setSelectedBH] = useState(null);

  const boardingHouses = [
    {
      id: 1,
      name: 'Boarding House 1',
      type: 'Male Dorm',
      price: '₱3,500/month',
      address: '123 Main St, Barangay Centro, City',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Bed', 'Study Table'],
      excludedAmenities: ['Air Conditioning', 'Laundry Service', 'Meals']
    },
    {
      id: 2,
      name: 'Boarding House 2',
      type: 'Female Dorm',
      price: '₱4,000/month',
      address: '456 Oak Ave, Barangay San Jose, City',
      images: ['image1.jpg', 'image2.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Air Conditioning', 'Bed'],
      excludedAmenities: ['Laundry Service', 'Meals', 'Parking']
    },
    {
      id: 3,
      name: 'Boarding House 3',
      type: 'Co-ed',
      price: '₱3,800/month',
      address: '789 Pine Rd, Barangay Poblacion, City',
      images: ['image1.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Bed', 'Study Table', 'Kitchen Access'],
      excludedAmenities: ['Air Conditioning', 'Parking']
    },
    {
      id: 4,
      name: 'Boarding House 4',
      type: 'Male Dorm',
      price: '₱3,200/month',
      address: '321 Elm St, Barangay Santa Cruz, City',
      images: ['image1.jpg', 'image2.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Bed'],
      excludedAmenities: ['Air Conditioning', 'Laundry Service', 'Meals', 'Study Table']
    },
    {
      id: 5,
      name: 'Boarding House 5',
      type: 'Female Dorm',
      price: '₱4,500/month',
      address: '654 Maple Dr, Barangay San Pedro, City',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Air Conditioning', 'Bed', 'Study Table', 'Laundry Service'],
      excludedAmenities: ['Meals', 'Parking']
    },
    {
      id: 6,
      name: 'Boarding House 6',
      type: 'Co-ed',
      price: '₱3,600/month',
      address: '987 Cedar Ln, Barangay San Antonio, City',
      images: ['image1.jpg', 'image2.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Bed', 'Kitchen Access'],
      excludedAmenities: ['Air Conditioning', 'Laundry Service', 'Meals']
    },
    {
      id: 7,
      name: 'Boarding House 7',
      type: 'Male Dorm',
      price: '₱3,900/month',
      address: '147 Birch St, Barangay San Miguel, City',
      images: ['image1.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Air Conditioning', 'Bed', 'Study Table'],
      excludedAmenities: ['Laundry Service', 'Meals', 'Kitchen Access']
    },
    {
      id: 8,
      name: 'Boarding House 8',
      type: 'Female Dorm',
      price: '₱4,200/month',
      address: '258 Willow Ave, Barangay San Juan, City',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Air Conditioning', 'Bed', 'Laundry Service'],
      excludedAmenities: ['Meals', 'Parking', 'Kitchen Access']
    },
    {
      id: 9,
      name: 'Boarding House 9',
      type: 'Co-ed',
      price: '₱3,700/month',
      address: '369 Spruce Ct, Barangay San Rafael, City',
      images: ['image1.jpg', 'image2.jpg'],
      includedAmenities: ['WiFi', 'Water', 'Electricity', 'Bed', 'Study Table', 'Parking'],
      excludedAmenities: ['Air Conditioning', 'Laundry Service', 'Meals']
    }
  ];

  const handleCardClick = (bh) => {
    setSelectedBH(bh);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBH(null);
  };

  return (
    <div className="llhome-container">
      <LLNavbar onNavigate={onNavigate} />
      <div className="llhome-content">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Listings</div>
              <button className="add-bh-button" onClick={() => onNavigate('addbh')}>+ Add Boarding House</button>
            </div>
            <div className="card-items-container">
              {boardingHouses.slice(0, 3).map((bh) => (
                <div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
                  <div className="card-image-container"></div>
                  <div className="card-content">
                    <div className="card-name">{bh.name}</div>
                    <div className="card-type">{bh.type}</div>
                    <div className="card-price">{bh.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="card-items-container">
              {boardingHouses.slice(3, 5).map((bh) => (
                <div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
                  <div className="card-image-container"></div>
                  <div className="card-content">
                    <div className="card-name">{bh.name}</div>
                    <div className="card-type">{bh.type}</div>
                    <div className="card-price">{bh.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Occupied</div>
            <div className="card-items-container">
              {boardingHouses.slice(5, 9).map((bh) => (
                <div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
                  <div className="card-image-container"></div>
                  <div className="card-content">
                    <div className="card-name">{bh.name}</div>
                    <div className="card-type">{bh.type}</div>
                    <div className="card-price">{bh.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showModal && selectedBH && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content-llhome" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <div className="modal-images">
                <div className="modal-main-image"></div>
                <div className="modal-thumbnail-container">
                  {selectedBH.images.map((img, index) => (
                    <div key={index} className="modal-thumbnail"></div>
                  ))}
                </div>
              </div>

              <div className="modal-details">
                <h2 className="modal-bh-name">{selectedBH.name}</h2>
                <div className="modal-info-row">
                  <span className="modal-label">Address:</span>
                  <span className="modal-value">{selectedBH.address}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Type:</span>
                  <span className="modal-value">{selectedBH.type}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-label">Price:</span>
                  <span className="modal-value modal-price">{selectedBH.price}</span>
                </div>

                <div className="modal-amenities">
                  <div className="amenities-section">
                    <h3 className="amenities-title">Included Amenities</h3>
                    <ul className="amenities-list">
                      {selectedBH.includedAmenities.map((amenity, index) => (
                        <li key={index} className="amenity-item included">{amenity}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="amenities-section">
                    <h3 className="amenities-title">Excluded Amenities</h3>
                    <ul className="amenities-list">
                      {selectedBH.excludedAmenities.map((amenity, index) => (
                        <li key={index} className="amenity-item excluded">{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLHome;
