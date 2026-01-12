import React, { useState } from 'react';
import LLVerify from './llverify';
import '../styles/llreservations.css';
import LLNavbar from './llnavbar';

const LLReservations = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const reservations = [
    { 
      id: 1, 
      name: 'John Doe',
      address: '456 Elm Street, Barangay San Roque, City',
      age: 22,
      gender: 'Male',
      civilStatus: 'Single',
      birthdate: '2003-05-15',
      contactNumber: '09123456789',
      boardingHouse: 'Boarding House 1',
      bhAddress: '123 Main St, Barangay Centro, City',
      type: 'Male Dorm',
      price: '₱3,500/month',
      date: '2026-01-10'
    },
    { 
      id: 2, 
      name: 'Jane Smith',
      address: '789 Maple Avenue, Barangay Santa Maria, City',
      age: 24,
      gender: 'Female',
      civilStatus: 'Single',
      birthdate: '2001-08-22',
      contactNumber: '09987654321',
      boardingHouse: 'Boarding House 2',
      bhAddress: '456 Oak Ave, Barangay San Jose, City',
      type: 'Female Dorm',
      price: '₱4,000/month',
      date: '2026-01-12'
    },
    { 
      id: 3, 
      name: 'Mike Johnson',
      address: '321 Pine Road, Barangay Del Pilar, City',
      age: 23,
      gender: 'Male',
      civilStatus: 'Single',
      birthdate: '2002-11-30',
      contactNumber: '09111222333',
      boardingHouse: 'Boarding House 3',
      bhAddress: '789 Pine Rd, Barangay Poblacion, City',
      type: 'Co-ed',
      price: '₱3,800/month',
      date: '2026-01-15'
    },
  ];

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="llreservations-container">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
      <LLVerify show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="llreservations-content">
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-name">{reservation.name}</div>
              <button className="view-details-button" onClick={() => handleViewDetails(reservation)}>View Details</button>
            </div>
          ))}
        </div>

        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content-reservation" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <h2 className="modal-title">Reservation Details</h2>

              <div className="modal-section">
                <h3 className="section-title">Tenant Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{selectedReservation.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{selectedReservation.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{selectedReservation.age}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender:</span>
                    <span className="info-value">{selectedReservation.gender}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Civil Status:</span>
                    <span className="info-value">{selectedReservation.civilStatus}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Birthdate:</span>
                    <span className="info-value">{selectedReservation.birthdate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Contact Number:</span>
                    <span className="info-value">{selectedReservation.contactNumber}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Boarding House Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedReservation.boardingHouse}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{selectedReservation.bhAddress}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{selectedReservation.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Price:</span>
                    <span className="info-value">{selectedReservation.price}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Reservation Date:</span>
                    <span className="info-value">{selectedReservation.date}</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="reject-button">Reject</button>
                <button className="approve-button">Approve</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLReservations;
