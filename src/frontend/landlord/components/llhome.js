import React, { useState, useEffect } from 'react';
import LLVerify from './llverify';
import '../styles/llhome.css';
import LLNavbar from './llnavbar';
import { db, auth } from '../../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LLHome = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBH, setSelectedBH] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showAllListings, setShowAllListings] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllOccupied, setShowAllOccupied] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false); // For 'Verification Required' modal
  const [showPaymentModal, setShowPaymentModal] = useState(false); // For 'Account Verification Payment' modal
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [approvedReservations, setApprovedReservations] = useState([]);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [showMenuId, setShowMenuId] = useState(null); // For three-dots menu

  useEffect(() => {
    const fetchBoardingHousesAndReservations = async () => {
      const user = auth.currentUser;
      if (!user) {
        setBoardingHouses([]);
        setApprovedReservations([]);
        return;
      }

      // Fetch and update isVerified status from Firestore
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const localUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          localUserData.isVerified = Boolean(userData.isVerified);
          localUserData.status = userData.status;
          localStorage.setItem('userData', JSON.stringify(localUserData));
        }
      } catch (err) {
        console.error('Error updating isVerified from Firestore:', err);
      }

      // Fetch boarding houses
      const bhQ = query(collection(db, 'boardingHouses'), where('userId', '==', user.uid));
      const bhSnapshot = await getDocs(bhQ);
      const houses = [];
      bhSnapshot.forEach((doc) => {
        houses.push({ id: doc.id, ...doc.data() });
      });
      setBoardingHouses(houses);

      // Fetch approved reservations for these boarding houses
      const bhIds = houses.map(bh => bh.id);
      if (bhIds.length === 0) {
        setApprovedReservations([]);
        return;
      }
      // Firestore doesn't support 'in' queries with more than 10 items, so batch if needed
      let reservations = [];
      for (let i = 0; i < bhIds.length; i += 10) {
        const batchIds = bhIds.slice(i, i + 10);
        const resQ = query(
          collection(db, 'reservations'),
          where('boardingHouseId', 'in', batchIds),
          where('status', '==', 'Approved')
        );
        const resSnapshot = await getDocs(resQ);
        resSnapshot.forEach((doc) => {
          reservations.push({ id: doc.id, ...doc.data() });
        });
      }
      setApprovedReservations(reservations);
    };
    fetchBoardingHousesAndReservations();
  }, []);

  const handleCardClick = async (bh) => {
    if (bh._reservation) {
      setSelectedReservation(bh._reservation);
      // Fetch tenant details from users collection
      const tenantId = bh._reservation.tenantId;
      if (tenantId) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const userRef = doc(db, 'users', tenantId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setTenantDetails(userSnap.data());
          } else {
            setTenantDetails(null);
          }
        } catch (err) {
          setTenantDetails(null);
        }
      } else {
        setTenantDetails(null);
      }
      setShowModal(true);
    } else {
      setSelectedBH(bh);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBH(null);
    setSelectedReservation(null);
    setTenantDetails(null);
  };

  const handleMakeAvailable = async (reservation, bh) => {
    try {
      const { doc, deleteDoc, updateDoc, getDoc } = await import('firebase/firestore');
      // Delete the reservation (removes from occupied)
      await deleteDoc(doc(db, 'reservations', reservation.id));
      
      // Update boarding house to add back available room and clear tenantId
      const bhRef = doc(db, 'boardingHouses', bh.id);
      const bhSnap = await getDoc(bhRef);
      if (bhSnap.exists()) {
        const bhData = bhSnap.data();
        let availableRooms = parseInt(bhData.availableRooms, 10) || 0;
        availableRooms += 1;
        
        // Clear tenantId and update status
        await updateDoc(bhRef, { 
          availableRooms: availableRooms,
          tenantId: null,  // Clear tenantId so it appears as available in admin
          status: 'approved'  // Reset status to approved/available
        });
      }
      
      // Refresh the occupied rooms list
      const updated = approvedReservations.filter(r => r.id !== reservation.id);
      setApprovedReservations(updated);
      closeModal();
      alert('Room made available successfully!');
    } catch (error) {
      console.error('Error making room available:', error);
      alert('Failed to make room available');
    }
  };

  const handleDeleteBoardingHouse = async (bhId) => {
    if (!window.confirm('Are you sure you want to delete this boarding house? This action cannot be undone.')) {
      return;
    }
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      // Delete the boarding house document
      await deleteDoc(doc(db, 'boardingHouses', bhId));
      
      // Update the boarding houses list to remove the deleted item
      const updated = boardingHouses.filter(bh => bh.id !== bhId);
      setBoardingHouses(updated);
      setShowMenuId(null);
      alert('Boarding house deleted successfully!');
    } catch (error) {
      console.error('Error deleting boarding house:', error);
      alert('Failed to delete boarding house');
    }
  };

  // Filter by status
  const listings = boardingHouses.filter(bh => bh.status === 'approved');
  const pending = boardingHouses.filter(bh => bh.status === 'pending');
  // Occupied cards: one per approved reservation
  const occupiedRooms = approvedReservations.map(res => {
    const bh = boardingHouses.find(bh => bh.id === res.boardingHouseId);
    return bh ? { ...bh, _reservation: res } : null;
  }).filter(Boolean);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isVerified = Boolean(userData.isVerified);
  console.log('LLHome: isVerified =', isVerified, '| userData:', userData);

  return (
    <div className="llhome-container">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowPaymentModal(true)} />
      <LLVerify show={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
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
                <button
                  className="add-bh-button"
                  onClick={() => {
                    if (isVerified) {
                      onNavigate('addbh');
                    } else {
                      setShowVerifyModal(true);
                    }
                  }}
                  title={isVerified ? '' : 'You must verify your account first'}
                >
                  + Add Boarding House
                </button>
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
                    {row.slice(0, 5).map((bh) => {
                      const cardId = `listing-${bh.id}`;
                      return (
                        <div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)} style={{ position: 'relative' }}>
                          <div className="card-image-container">
                            {bh.images && bh.images.length > 0 && (
                              <img src={bh.images[0]} alt="Boarding House" className="card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                          </div>
                          <div className="card-content">
                            <div className="card-name">{bh.name}</div>
                            <div className="card-type">{bh.type}</div>
                            <div className="card-price">{bh.price}</div>
                          </div>
                          {/* Three-dots menu */}
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMenuId(showMenuId === cardId ? null : cardId);
                              }}
                              style={{
                                background: 'rgba(255,255,255,0.9)',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                              }}
                            >
                              ⋮
                            </button>
                            {showMenuId === cardId && (
                              <div style={{
                                position: 'absolute',
                                top: '32px',
                                right: '0',
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '150px',
                              }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBoardingHouse(bh.id);
                                  }}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#d32f2f',
                                  }}
                                  onMouseEnter={(e) => e.target.style.background = '#ffebee'}
                                  onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Pending Section */}
          {/* Pending Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Pending</div>
            </div>
            <div className="card-items-container">
              {pending.length === 0 ? (
                <div className="no-pending-message"></div>
              ) : (
                pending.map((bh) => (
                  <div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
                    <div className="card-image-container">
                      {bh.images && bh.images.length > 0 && (
                        <img src={bh.images[0]} alt="Boarding House" className="card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-name">{bh.name}</div>
                      <div className="card-type">{bh.type}</div>
                      <div className="card-price">{bh.price}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Occupied Section */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-label">Occupied</div>
              {occupiedRooms.length > 5 && (
                <button className="see-all-btn" onClick={() => setShowAllOccupied((v) => !v)}>
                  {showAllOccupied ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            <div className="card-items-container">
              {(() => {
                const arr = showAllOccupied ? occupiedRooms : occupiedRooms.slice(0, 10);
                const rows = [];
                for (let i = 0; i < arr.length; i += 5) {
                  rows.push(arr.slice(i, i + 5));
                }
                return rows.map((row, idx) => (
                  <div key={idx} className="card-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {row.slice(0, 5).map((bh, i) => {
                      const cardId = bh.id + '-' + (bh._reservation ? bh._reservation.id : i);
                      return (
                        <div key={cardId} className="rectangle-card" onClick={() => handleCardClick(bh)} style={{ position: 'relative' }}>
                          <div className="card-image-container">
                            {bh.images && bh.images.length > 0 && (
                              <img src={bh.images[0]} alt="Boarding House" className="card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                          </div>
                          <div className="card-content">
                            <div className="card-name">{bh.name}</div>
                            <div className="card-type">{bh.type}</div>
                            <div className="card-price">{bh.price}</div>
                          </div>
                          {/* Three-dots menu */}
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMenuId(showMenuId === cardId ? null : cardId);
                              }}
                              style={{
                                background: 'rgba(255,255,255,0.9)',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                              }}
                            >
                              ⋮
                            </button>
                            {showMenuId === cardId && (
                              <div style={{
                                position: 'absolute',
                                top: '32px',
                                right: '0',
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '150px',
                              }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (bh._reservation) {
                                      handleMakeAvailable(bh._reservation, bh);
                                    }
                                    setShowMenuId(null);
                                  }}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#333',
                                  }}
                                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                  onMouseLeave={(e) => e.target.style.background = 'none'}
                                >
                                  Make Available
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content-llhome" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left' }}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <h2 className="modal-title">Tenant Details</h2>
              <div className="modal-section">
                <h3 className="section-title">Tenant Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">
                      {tenantDetails && (tenantDetails.firstName || tenantDetails.middleName || tenantDetails.lastName)
                        ? `${tenantDetails.firstName || ''} ${tenantDetails.middleName || ''} ${tenantDetails.lastName || ''}`.replace(/ +/g, ' ').trim()
                        : (selectedReservation.name || selectedReservation.tenantName || 'N/A')}
                    </span>
                  </div>
                  <div className="info-item"><span className="info-label">Address:</span> <span className="info-value">{selectedReservation.address || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Gender:</span> <span className="info-value">{selectedReservation.gender || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Civil Status:</span> <span className="info-value">{selectedReservation.civilStatus || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Birthdate:</span> <span className="info-value">{selectedReservation.birthdate || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Contact Number:</span> <span className="info-value">{selectedReservation.contactNumber || 'N/A'}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModal && !selectedReservation && selectedBH && (
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

        {showVerifyModal && (
          <div className="modal-overlay" style={{zIndex: 9999, background: 'rgba(0,0,0,0.7)'}} onClick={() => setShowVerifyModal(false)}>
            <div className="modal-content-llverify" style={{zIndex: 10000, background: '#fff'}} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowVerifyModal(false)}>×</button>
              <h2 className="modal-title">Verification Required</h2>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p style={{ fontWeight: 'bold', marginBottom: 12, color: 'black' }}>You must verify your account before you can add a boarding house.</p>
                <p>Go to <b>Settings</b> &gt; <b>Verify Account</b> to complete verification.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLHome;
