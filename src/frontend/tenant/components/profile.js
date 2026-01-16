import React, { useState, useEffect, useRef } from 'react';
import '../styles/profile.css';
import Navbar from './navbar';

const Profile = ({ onNavigate }) => {
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef(null);

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    // Get user data from localStorage (you can also fetch from Firebase)
    const storedUserData = localStorage.getItem('userData');
    console.log('Stored user data:', storedUserData);
    
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      console.log('Parsed user data:', parsedData);
      setUserData(parsedData);
    } else {
      // If no data in localStorage, set dummy data for testing
      console.log('No user data found in localStorage');
      const dummyData = {
        firstName: 'John',
        middleName: 'Michael',
        surname: 'Doe',
        email: 'john.doe@example.com',
        gender: 'Male',
        civilStatus: 'Single',
        birthdate: '1995-01-01',
        mobileNumber: '+63 912 345 6789',
        occupationType: 'Student',
        street: '123 Main Street',
        barangay: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province'
      };
      setUserData(dummyData);
    }

    // Get profile picture from localStorage
    const storedProfilePic = localStorage.getItem('profilePicture');
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
        localStorage.setItem('profilePicture', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserDataToLocalStorage = (data) => {
    // Ensure all required fields are present
    const completeData = {
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      surname: data.surname || '',
      email: data.email || '',
      gender: data.gender || '',
      civilStatus: data.civilStatus || '',
      birthdate: data.birthdate || '',
      mobileNumber: data.mobileNumber || '',
      occupationType: data.occupationType || '',
      street: data.street || '',
      barangay: data.barangay || '',
      city: data.city || '',
      province: data.province || '',
      address: `${data.street || ''}, ${data.barangay || ''}, ${data.city || ''}, ${data.province || ''}`.replace(/, +/g, ', ').replace(/^, |, $/g, ''),
      age: data.age || '',
      id: data.id || '',
      uid: data.uid || '',
    };
    localStorage.setItem('userData', JSON.stringify(completeData));
  };

  const handleEditProfile = () => {
    // Example: Open a modal or form for editing profile
    // After editing, call saveUserDataToLocalStorage with updated data
    // For demonstration, we'll just update age, address, and name fields
    const updatedData = {
      ...userData,
      firstName: userData.firstName || 'John',
      middleName: userData.middleName || 'Michael',
      surname: userData.surname || 'Doe',
      age: userData.age || '25',
      street: userData.street || '123 Main Street',
      barangay: userData.barangay || 'Sample Barangay',
      city: userData.city || 'Sample City',
      province: userData.province || 'Sample Province',
    };
    saveUserDataToLocalStorage(updatedData);
    setUserData(updatedData);
    alert('Profile updated and saved!');
  };

  if (!userData) {
    return (
      <div className="profile-container">
        <Navbar onNavigate={onNavigate} />
        <div className="profile-content">
          <p className="profile-loading">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar onNavigate={onNavigate} />
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
          <h2 className="profile-section-title">Personal Information</h2>
          
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
              <label>Gender</label>
              <p>{userData.gender}</p>
            </div>

            <div className="profile-info-item">
              <label>Civil Status</label>
              <p>{userData.civilStatus}</p>
            </div>

            <div className="profile-info-item">
              <label>Age</label>
              <p>{calculateAge(userData.birthdate)}</p>
            </div>

            <div className="profile-info-item">
              <label>Birthdate</label>
              <p>{userData.birthdate}</p>
            </div>

            <div className="profile-info-item">
              <label>Mobile Number</label>
              <p>{userData.mobileNumber}</p>
            </div>

            {userData.occupationType && (
              <div className="profile-info-item">
                <label>Occupation Type</label>
                <p>{userData.occupationType}</p>
              </div>
            )}
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
            <button className="profile-edit-btn" onClick={handleEditProfile}>Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
