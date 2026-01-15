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
        const q = query(
          collection(db, 'reservations'),
          where('landlordId', '==', landlordId),
          where('status', '==', 'Pending')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                    const { doc, deleteDoc, updateDoc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../../../firebase/config');
                    // Refund 50 pesos to tenant's balance
                    if (selectedReservation.tenantId) {
                      const tenantRef = doc(db, 'users', selectedReservation.tenantId);
                      const tenantSnap = await getDoc(tenantRef);
                      if (tenantSnap.exists()) {
                        const tenantData = tenantSnap.data();
                        let balance = parseFloat(tenantData.balance) || 0;
                        balance += 50;
                        await updateDoc(tenantRef, { balance });
                      }
                    }
                    // Update reservation status to Rejected instead of deleting
                    await updateDoc(doc(db, 'reservations', selectedReservation.id), { status: 'Rejected' });
                  } catch (err) {
                    alert('Failed to reject reservation.');
                  }
                  setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
                  closeModal();
                }}>Reject</button>
                <button className="approve-button" onClick={async () => {
                  try {
                    const { doc, updateDoc, getDoc, setDoc } = await import('firebase/firestore');
                    const { db } = await import('../../../firebase/config');
                    // Update available rooms and status
                    if (selectedReservation.boardingHouseId) {
                      const bhRef = doc(db, 'boardingHouses', selectedReservation.boardingHouseId);
                      const bhSnap = await getDoc(bhRef);
                      if (bhSnap.exists()) {
                        const bhData = bhSnap.data();
                        let availableRooms = parseInt(bhData.availableRooms, 10);
                        if (isNaN(availableRooms)) availableRooms = 0;
                        const newRooms = availableRooms - 1;
                        if (newRooms <= 0) {
                          await updateDoc(bhRef, { availableRooms: 0, status: 'occupied' });
                        } else {
                          await updateDoc(bhRef, { availableRooms: newRooms });
                        }
                      }
                    }
                    // Add 50 pesos to landlord's balance in users or landlords collection
                    if (selectedReservation.landlordId) {
                      let updated = false;
                      // Try users collection
                      const userRef = doc(db, 'users', selectedReservation.landlordId);
                      const userSnap = await getDoc(userRef);
                      if (userSnap.exists()) {
                        const userData = userSnap.data();
                        let balance = parseFloat(userData.balance) || 0;
                        balance += 50;
                        await updateDoc(userRef, { balance });
                        updated = true;
                      }
                      // Try landlords collection if not found in users
                      if (!updated) {
                        const landlordRef = doc(db, 'landlords', selectedReservation.landlordId);
                        const landlordSnap = await getDoc(landlordRef);
                        if (landlordSnap.exists()) {
                          const landlordData = landlordSnap.data();
                          let balance = parseFloat(landlordData.balance) || 0;
                          balance += 50;
                          await updateDoc(landlordRef, { balance });
                          updated = true;
                        }
                      }
                      // If not found in either, create in users
                      if (!updated) {
                        await setDoc(userRef, { balance: 50 }, { merge: true });
                      }
                    }
                    // Optionally, update reservation status to 'Approved' (if you want to track it)
                    await updateDoc(doc(db, 'reservations', selectedReservation.id), { status: 'Approved' });
                  } catch (err) {
                    alert('Failed to approve reservation or update boarding house status.');
                    return;
                  }
                  // Remove the reservation from the list after approval
                  setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
                  closeModal();
                }}>Approve</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLReservations;
