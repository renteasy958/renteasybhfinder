import React, { useState } from 'react';
import LLVerify from './llverify';
import '../styles/llhome.css';
import LLNavbar from './llnavbar';

const LLHome = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBH, setSelectedBH] = useState(null);
  const [showAllListings, setShowAllListings] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllOccupied, setShowAllOccupied] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Sample data for demonstration
  // 10 listings, 10 pending, 10 occupied
  const boardingHouses = [
    // Listings (id: 1-10)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Listing House ${i + 1}`,
      type: ['Dormitory', 'Apartment', 'Studio'][i % 3],
      price: `₱${3500 + i * 200}/mo`,
      address: `${100 + i} Main St, City`,
      images: [`/images/listing${i + 1}a.jpg`],
      includedAmenities: ['WiFi', 'Water', 'Electricity'].slice(0, (i % 3) + 1),
      excludedAmenities: ['Laundry', 'Parking'].slice(0, (i % 2) + 1),
    })),
    // Pending (id: 11-20)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 11,
      name: `Pending House ${i + 1}`,
      type: ['Dormitory', 'Apartment', 'Studio'][i % 3],
      price: `₱${3600 + i * 150}/mo`,
      address: `${200 + i} Pending Rd, City`,
      images: [`/images/pending${i + 1}a.jpg`],
      includedAmenities: ['WiFi', 'Parking', 'Laundry'].slice(0, (i % 3) + 1),
      excludedAmenities: ['Water', 'Electricity'].slice(0, (i % 2) + 1),
    })),
    // Occupied (id: 21-30)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 21,
      name: `Occupied House ${i + 1}`,
      type: ['Dormitory', 'Apartment', 'Studio'][i % 3],
      price: `₱${3700 + i * 180}/mo`,
      address: `${300 + i} Occupied St, City`,
      images: [`/images/occupied${i + 1}a.jpg`],
      includedAmenities: ['Water', 'Electricity', 'Laundry'].slice(0, (i % 3) + 1),
      excludedAmenities: ['WiFi', 'Parking'].slice(0, (i % 2) + 1),
    })),
  ];

  const handleCardClick = (bh) => {
    setSelectedBH(bh);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBH(null);
  };

  // Example sections, you may want to filter by status in real app
  const listings = boardingHouses.slice(0, 10); // First 10 as listings
  const pending = boardingHouses.slice(10, 20); // Next 10 as pending
  const occupied = boardingHouses.slice(20, 30); // Next 10 as occupied

  return (
    <div className="llhome-container">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
      <LLVerify show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="llhome-content">
        <div className="stats-container">
          {/* Listings Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Listings</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {listings.length > 5 && (
                  <button className="see-all-btn" onClick={() => setShowAllListings((v) => !v)}>
                    {showAllListings ? 'Show Less' : 'See All'}
                  </button>
                )}
                <button className="add-bh-button" onClick={() => onNavigate('addbh')}>+ Add Boarding House</button>
              </div>
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
