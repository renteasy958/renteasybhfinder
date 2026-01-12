import React, { useState, useEffect, useRef } from 'react';
import '../styles/llprofile.css';
import LLNavbar from './llnavbar';
import LLVerify from './llverify';

const LLProfile = ({ onNavigate }) => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Get landlord data from localStorage (or fetch from Firebase)
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      // Dummy data for landlord
      setUserData({
        firstName: 'Landlord',
        middleName: '',
        surname: 'Sample',
        email: 'landlord@example.com',
        mobileNumber: '+63 900 000 0000',
        company: 'Sample Realty',
        street: '456 Realty Ave',
        barangay: 'Business District',
        city: 'Metro City',
        province: 'Metro Province'
      });
    }
    const storedProfilePic = localStorage.getItem('llProfilePicture');
    if (storedProfilePic) {
      setProfilePicture(storedProfilePic);
    }
  }, []);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfilePicture(imageData);
        localStorage.setItem('llProfilePicture', imageData);
      };
      reader.readAsDataURL(file);
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
              <label>Company</label>
              <p>{userData.company || 'N/A'}</p>
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
