import React, { useState, useEffect } from 'react';
import LLVerify from './llverify';
import '../styles/llreservations.css';
import LLNavbar from './llnavbar';

const LLReservations = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get landlord ID from localStorage (assumes userData contains landlord info)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    // Always use userId for consistency
    const landlordId = userData.userId || userData.uid || userData.id || '';
    console.log('DEBUG landlordId used for filtering:', landlordId);
    if (!landlordId) {
      setReservations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchReservations = async () => {
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../../firebase/config');
        const q = query(collection(db, 'reservations'), where('landlordId', '==', landlordId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // ...existing code...
        setReservations(data);
      } catch (error) {
        console.error('Error fetching landlord reservations:', error);
        setReservations([]);
      }
      setLoading(false);
    };
    fetchReservations();
  }, []);

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
          {loading ? (
            <div>Loading...</div>
          ) : reservations.length === 0 ? (
            <div>No reservations found.</div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                      <div className="reservation-info-row" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="reservation-tenant-name" style={{ marginRight: '24px', minWidth: '120px' }}>{reservation.tenantName || reservation.name}</span>
                        <span className="reservation-date" style={{ flex: 1, textAlign: 'center' }}>{reservation.date}</span>
                        <button className="view-details-button" style={{ marginLeft: '24px' }} onClick={() => handleViewDetails(reservation)}>View Details</button>
                      </div>
              </div>
            ))
          )}
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
                <button className="reject-button" onClick={async () => {
                  try {
                    const { doc, deleteDoc } = await import('firebase/firestore');
                    const { db } = await import('../../../firebase/config');
                    await deleteDoc(doc(db, 'reservations', selectedReservation.id));
                  } catch (err) {
                    alert('Failed to delete reservation from Firestore.');
                  }
                  setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
                  closeModal();
                }}>Reject</button>
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
