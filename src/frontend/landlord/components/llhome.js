import React, { useState } from 'react';
import '../styles/llhome.css';
import LLNavbar from './llnavbar';

const LLHome = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBH, setSelectedBH] = useState(null);
  const [showAllListings, setShowAllListings] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllOccupied, setShowAllOccupied] = useState(false);

  const boardingHouses = [];

  const handleCardClick = (bh) => {
    setSelectedBH(bh);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBH(null);
  };

  // Example sections, you may want to filter by status in real app
  const listings = boardingHouses.slice(0, 6); // Example: first 6 as listings
  const pending = boardingHouses.slice(6, 8); // Example: next 2 as pending
  const occupied = boardingHouses.slice(8);   // Example: rest as occupied

  return (
    <div className="llhome-container">
      <LLNavbar onNavigate={onNavigate} />
      <div className="llhome-content">
        <div className="stats-container">
          {/* Listings Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Listings</div>
              <button className="add-bh-button" onClick={() => onNavigate('addbh')}>+ Add Boarding House</button>
              {listings.length > 5 && (
                <button className="see-all-btn" onClick={() => setShowAllListings((v) => !v)}>
                  {showAllListings ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="card-items-container">
              {(() => {
                const arr = showAllListings ? listings : listings.slice(0, 10);
                const rows = [];
                for (let i = 0; i < arr.length; i += 5) {
                  rows.push(arr.slice(i, i + 5));
                }
                return rows.map((row, idx) => (
                  <div key={idx} className="card-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {row.slice(0, 5).map((bh) => (
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
                ));
              })()}
            </div>
          </div>

          {/* Pending Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Pending</div>
              {pending.length > 5 && (
                <button className="see-all-btn" onClick={() => setShowAllPending((v) => !v)}>
                  {showAllPending ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="card-items-container">
              {(() => {
                const arr = showAllPending ? pending : pending.slice(0, 10);
                const rows = [];
                for (let i = 0; i < arr.length; i += 5) {
                  rows.push(arr.slice(i, i + 5));
                }
                return rows.map((row, idx) => (
                  <div key={idx} className="card-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {row.slice(0, 5).map((bh) => (
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
                ));
              })()}
            </div>
          </div>

          {/* Occupied Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Occupied</div>
              {occupied.length > 5 && (
                <button className="see-all-btn" onClick={() => setShowAllOccupied((v) => !v)}>
                  {showAllOccupied ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="card-items-container">
              {(() => {
                const arr = showAllOccupied ? occupied : occupied.slice(0, 10);
                const rows = [];
                for (let i = 0; i < arr.length; i += 5) {
                  rows.push(arr.slice(i, i + 5));
                }
                return rows.map((row, idx) => (
                  <div key={idx} className="card-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {row.slice(0, 5).map((bh) => (
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
                ));
              })()}
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
