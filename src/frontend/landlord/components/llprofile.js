import React, { useState, useEffect, useRef } from 'react';
import '../styles/llprofile.css';
import LLNavbar from './llnavbar';
import LLVerify from './llverify';
import { db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const LLProfile = ({ onNavigate }) => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get landlord data from Firestore using userData from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      const landlordId = parsed.uid || parsed.userId || parsed.id;
      if (landlordId) {
        getDoc(doc(db, 'landlords', landlordId)).then(snap => {
          if (snap.exists()) {
            setUserData({ ...snap.data(), ...parsed });
          } else {
            setUserData(parsed); // fallback to localStorage if not found in Firestore
          }
        });
      } else {
        setUserData(parsed);
      }
    }
    const storedProfilePic = localStorage.getItem('llProfilePicture');
    if (storedProfilePic) {
      setProfilePicture(storedProfilePic);
    }
  }, []);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        // Adjust the URL if your backend runs elsewhere
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.url) {
          setProfilePicture(data.url);
          localStorage.setItem('llProfilePicture', data.url);
        } else {
          alert('Image upload failed.');
        }
      } catch (err) {
        alert('Error uploading image.');
      }
    }
  };


  if (!userData) {
    return (
      <div className="profile-container">
        <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
        <div className="profile-content">
          <p className="profile-loading">Loading profile...</p>
        </div>
        {showVerifyModal && (
          <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
            <div className="modal-content-llverify" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowVerifyModal(false)}>×</button>
              <h2 className="modal-title">Verify Account</h2>
              <div style={{ textAlign: 'center', padding: 24 }}>
                <p>Verification instructions or form goes here.</p>
                <button className="approve-button" onClick={() => setShowVerifyModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
      <LLVerify show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar" onClick={handleProfilePictureClick}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-avatar-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="profile-upload-hint">Click to upload</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <h1 className="profile-name">{`${userData.firstName} ${userData.middleName} ${userData.surname}`}</h1>
          <p className="profile-email">{userData.email}</p>
        </div>

        <div className="profile-details">

          <h2 className="profile-section-title">Landlord Information</h2>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label>First Name</label>
              <p>{userData.firstName}</p>
            </div>
            <div className="profile-info-item">
              <label>Middle Name</label>
              <p>{userData.middleName || 'N/A'}</p>
            </div>
            <div className="profile-info-item">
              <label>Surname</label>
              <p>{userData.surname}</p>
            </div>
            <div className="profile-info-item">
              <label>Mobile Number</label>
              <p>{userData.mobileNumber}</p>
            </div>
            <div className="profile-info-item">
              <label>Civil Status</label>
              <p>{userData.civilStatus || 'N/A'}</p>
            </div>
            <div className="profile-info-item">
              <label>Gender</label>
              <p>{userData.gender || 'N/A'}</p>
            </div>
            <div className="profile-info-item">
              <label>Age</label>
              <p>{userData.age || 'N/A'}</p>
            </div>
            <div className="profile-info-item">
              <label>Birthdate</label>
              <p>{userData.birthdate || 'N/A'}</p>
            </div>
          </div>

          <h2 className="profile-section-title">Address</h2>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label>Street</label>
              <p>{userData.street}</p>
            </div>
            <div className="profile-info-item">
              <label>Barangay</label>
              <p>{userData.barangay}</p>
            </div>
            <div className="profile-info-item">
              <label>City</label>
              <p>{userData.city}</p>
            </div>
            <div className="profile-info-item">
              <label>Province</label>
              <p>{userData.province}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-edit-btn">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLProfile;
