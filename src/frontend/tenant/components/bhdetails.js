import React, { useState, useEffect } from 'react';
import '../styles/bhdetails.css';
import Navbar from './navbar';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const BHDetails = ({ bhId, onNavigateBack, onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [boardingHouse, setBoardingHouse] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBH = async () => {
      if (!bhId) return;
      try {
        const { db } = await import('../../../firebase/config');
        const { doc, getDoc } = await import('firebase/firestore');
        const bhDoc = await getDoc(doc(db, 'boardingHouses', bhId));
        if (bhDoc.exists()) {
          const bhData = { id: bhDoc.id, ...bhDoc.data() };
          setBoardingHouse(bhData);
          // Fetch landlord info from localStorage (llprofile)
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            setLandlord(JSON.parse(storedUserData));
          } else {
            setLandlord(null);
          }
        } else {
          setBoardingHouse(null);
          setLandlord(null);
        }
      } catch (error) {
        console.error('Error fetching boarding house or landlord details:', error);
        setBoardingHouse(null);
        setLandlord(null);
      }
    };
    fetchBH();
  }, [bhId]);

  useEffect(() => {
    if (!boardingHouse) return;
    const likedBoardingHouses = JSON.parse(localStorage.getItem('likedBoardingHouses') || '[]');
    setIsLiked(likedBoardingHouses.some(bh => bh.id === boardingHouse.id));
  }, [boardingHouse]);

  if (!boardingHouse) {
    return (
      <div className="bhdetails-container">
        <Navbar onNavigate={onNavigate} />
        <div className="bhdetails-wrapper">
          <div className="bhdetails-loading">Loading...</div>
        </div>
      </div>
    );
  }

  const images = boardingHouse.images || [];
  const inclusions = boardingHouse.includedAmenities || [];
  const exclusions = boardingHouse.excludedAmenities || [];

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
      const updated = likedBoardingHouses.filter(bh => bh.id !== boardingHouse.id);
      localStorage.setItem('likedBoardingHouses', JSON.stringify(updated));
      setIsLiked(false);
    } else {
      likedBoardingHouses.push({ id: boardingHouse.id, name: boardingHouse.name });
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
            {images.length > 0 && (
              <>
                <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <div className="carousel-image">
                  <img src={images[currentImageIndex]} alt="Boarding House" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              </>
            )}
            {images.length === 0 && (
              <div className="carousel-image">
                <span className="carousel-placeholder">No images</span>
              </div>
            )}
          </div>
          <div className="bh-name-container">
            <div className="bh-name-header">
              <h1 className="bh-name">
                {boardingHouse.name}
                <button className="heart-btn" onClick={toggleLike}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? "#012e6a" : "none"} stroke="#012e6a" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </h1>
              <div className="rooms-left">
                <span className="rooms-left-number">{boardingHouse.availableRooms ?? '-'}</span>
                <span className="rooms-left-text">rooms left</span>
              </div>
            </div>
            <p className="bh-address">
              {boardingHouse.sitio ? `${boardingHouse.sitio}, ` : ''}
              {boardingHouse.barangay ? `Brgy. ${boardingHouse.barangay}, ` : ''}
              {boardingHouse.municipality ? `${boardingHouse.municipality}, ` : ''}
              {boardingHouse.province ? `${boardingHouse.province}` : ''}
            </p>
            <p className="bh-price">₱{boardingHouse.price}</p>
          </div>
          <div className="map-container">
            {boardingHouse.location && boardingHouse.location.lat && boardingHouse.location.lng ? (
              <MapContainer
                center={[boardingHouse.location.lat, boardingHouse.location.lng]}
                zoom={17}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={[boardingHouse.location.lat, boardingHouse.location.lng]} />
              </MapContainer>
            ) : (
              <div className="map-placeholder">Map View</div>
            )}
          </div>
          <div className="landlord-info-container">
            <h2 className="landlord-info-title">Landlord's Contact Information</h2>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Full Name:</span>
              <span className="landlord-info-value">
                {landlord && (landlord.firstName || landlord.middleName || landlord.surname)
                  ? `${landlord.firstName || ''} ${landlord.middleName || ''} ${landlord.surname || ''}`.replace(/  +/g, ' ').trim()
                  : '-'}
              </span>
            </div>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Contact Number:</span>
              <span className="landlord-info-value">{landlord && landlord.mobileNumber ? landlord.mobileNumber : '-'}</span>
            </div>
            <div className="landlord-info-item">
              <span className="landlord-info-label">Address:</span>
              <span className="landlord-info-value">
                {landlord && (landlord.street || landlord.barangay || landlord.city || landlord.province)
                  ? `${landlord.street || ''}${landlord.street ? ', ' : ''}${landlord.barangay || ''}${landlord.barangay ? ', ' : ''}${landlord.city || ''}${landlord.city ? ', ' : ''}${landlord.province || ''}`.replace(/, $/, '').replace(/, ,/g, ',').replace(/^, | ,$/g, '').trim()
                  : '-'}
              </span>
            </div>
          </div>
        </div>
        <div className="bhdetails-right">
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">
              {boardingHouse.description || 'No description provided.'}
            </p>
          </div>
          <div className="inclusions-section">
            <h3 className="inclusions-title">Inclusions</h3>
            <ul className="inclusions-list">
              {inclusions.length > 0 ? inclusions.map((item, idx) => <li key={idx}>{item}</li>) : <li>No inclusions listed.</li>}
            </ul>
          </div>
          <div className="exclusions-section">
            <h3 className="exclusions-title">Exclusions</h3>
            <ul className="exclusions-list">
              {exclusions.length > 0 ? exclusions.map((item, idx) => <li key={idx}>{item}</li>) : <li>No exclusions listed.</li>}
            </ul>
          </div>
          <button className="reserve-btn" onClick={() => setShowModal(true)}>Reserve</button>
        </div>
      </div>
      {showModal && !showPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setShowModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="modal-title">RESERVATION NOTICE</h2>
            <p className="modal-text">
              A 50 pesos reservation fee is required to confirm your reservation. 
              Please wait for the approval of the landlord.
            </p>
            <button className="modal-proceed-btn" onClick={() => setShowPayment(true)}>Proceed</button>
          </div>
        </div>
      )}
      {showPayment && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setShowPayment(false); }}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => { setShowModal(false); setShowPayment(false); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="modal-title">PAYMENT</h2>
            <div className="payment-content">
              <div className="qr-section">
                <img src={require('../../images/50.jpg')} alt="QR Code" className="qr-code" />
                <div className="gcash-label">GCash</div>
              </div>
              <div className="payment-details">
                <h3 className="payment-name">RENT EASY</h3>
                <p className="payment-account">Account Number: 09158706048</p>
                <div className="reference-input-group">
                  <label className="reference-label">Reference Number</label>
                  <input 
                    type="text" 
                    className="reference-input" 
                    placeholder="Enter reference number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
                <button 
                  className="submit-btn" 
                  onClick={() => { setShowPayment(false); setShowSuccess(true); }}
                  disabled={!referenceNumber.trim()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-checkmark">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <p className="success-text">
              Your transaction is successful. Please wait for the approval of the landlord.
            </p>
            <button 
              className="modal-close-btn" 
              onClick={() => { 
                setShowModal(false); 
                setShowPayment(false); 
                setShowSuccess(false); 
                setReferenceNumber(''); 
                onNavigate('home');
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BHDetails;
