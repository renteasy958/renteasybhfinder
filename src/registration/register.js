import React, { useState } from 'react';
import './register.css';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ onNavigateToLogin, onNavigateToHome, onNavigateToLLHome }) => {
  const [userType, setUserType] = useState('tenant');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  console.log('Register component - showSuccess:', showSuccess);
  
  const [tenantData, setTenantData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    civilStatus: '',
    gender: '',
    birthdate: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    mobileNumber: '',
    occupationType: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [landlordData, setLandlordData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    civilStatus: '',
    gender: '',
    birthdate: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    mobileNumber: '',
    boardingHouseName: '',
    bhStreet: '',
    bhBarangay: '',
    bhCity: 'Isabela',
    bhProvince: 'Negros Occidental',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTenantChange = (e) => {
    setTenantData({ ...tenantData, [e.target.name]: e.target.value });
  };

  const handleLandlordChange = (e) => {
    setLandlordData({ ...landlordData, [e.target.name]: e.target.value });
  };

  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMITTED ===');
    console.log('Tenant Data:', tenantData);
    setError('');
    
    try {
      // Validate passwords match
      if (tenantData.password !== tenantData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      console.log('Creating Firebase user...');
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        tenantData.email,
        tenantData.password
      );

      console.log('Saving to Firestore...');
      // Save additional tenant data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        userType: 'tenant',
        firstName: tenantData.firstName,
        middleName: tenantData.middleName,
        surname: tenantData.surname,
        civilStatus: tenantData.civilStatus,
        gender: tenantData.gender,
        birthdate: tenantData.birthdate,
        address: {
          street: tenantData.street,
          barangay: tenantData.barangay,
          city: tenantData.city,
          province: tenantData.province
        },
        mobileNumber: tenantData.mobileNumber,
        occupationType: tenantData.occupationType,
        email: tenantData.email,
        createdAt: new Date().toISOString()
      });

      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        uid: userCredential.user.uid,
        userId: userCredential.user.uid,
        userType: 'tenant',
        firstName: tenantData.firstName,
        middleName: tenantData.middleName,
        surname: tenantData.surname,
        civilStatus: tenantData.civilStatus,
        gender: tenantData.gender,
        birthdate: tenantData.birthdate,
        street: tenantData.street,
        barangay: tenantData.barangay,
        city: tenantData.city,
        province: tenantData.province,
        mobileNumber: tenantData.mobileNumber,
        occupationType: tenantData.occupationType,
        email: tenantData.email
      }));

      console.log('Registration successful! Showing animation...');
      // Show success animation AFTER saving
      setShowSuccess(true);
      
      // Redirect to home after animation
      setTimeout(() => {
        console.log('Redirecting to home');
        onNavigateToHome();
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    }
  };

  const handleLandlordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate passwords match
      if (landlordData.password !== landlordData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        landlordData.email,
        landlordData.password
      );

      // Save additional landlord data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        userType: 'landlord',
        firstName: landlordData.firstName,
        middleName: landlordData.middleName,
        surname: landlordData.surname,
        civilStatus: landlordData.civilStatus,
        gender: landlordData.gender,
        birthdate: landlordData.birthdate,
        address: {
          street: landlordData.street,
          barangay: landlordData.barangay,
          city: landlordData.city,
          province: landlordData.province
        },
        mobileNumber: landlordData.mobileNumber,
        boardingHouse: {
          name: landlordData.boardingHouseName,
          address: {
            street: landlordData.bhStreet,
            barangay: landlordData.bhBarangay,
            city: landlordData.bhCity,
            province: landlordData.bhProvince
          }
        },
        email: landlordData.email,
        createdAt: new Date().toISOString()
      });

      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        uid: userCredential.user.uid,
        userId: userCredential.user.uid,
        userType: 'landlord',
        firstName: landlordData.firstName,
        middleName: landlordData.middleName,
        surname: landlordData.surname,
        civilStatus: landlordData.civilStatus,
        gender: landlordData.gender,
        birthdate: landlordData.birthdate,
        street: landlordData.street,
        barangay: landlordData.barangay,
        city: landlordData.city,
        province: landlordData.province,
        mobileNumber: landlordData.mobileNumber,
        boardingHouseName: landlordData.boardingHouseName,
        bhStreet: landlordData.bhStreet,
        bhBarangay: landlordData.bhBarangay,
        bhCity: landlordData.bhCity,
        bhProvince: landlordData.bhProvince,
        email: landlordData.email
      }));

      console.log('Landlord registration successful:', userCredential.user);
      setShowSuccess(true);
      setTimeout(() => {
        onNavigateToLLHome();
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-modal register-form-modal">
        <div className="register-tabs">
          <div 
            className={`register-tab ${userType === 'tenant' ? 'register-tab-active' : ''}`}
            onClick={() => setUserType('tenant')}
          >
            Tenant
          </div>
          <div 
            className={`register-tab ${userType === 'landlord' ? 'register-tab-active' : ''}`}
            onClick={() => setUserType('landlord')}
          >
            Landlord
          </div>
        </div>

        {userType === 'tenant' ? (
          <>
            <h2 className="register-title">Tenant Registration</h2>
            
            {error && <div className="register-error-message">{error}</div>}
          
          <form onSubmit={handleTenantSubmit}>
            <div className="register-form-row">
              <input type="text" name="firstName" placeholder="First Name" value={tenantData.firstName} onChange={handleTenantChange} className="register-input" required />
              <input type="text" name="middleName" placeholder="Middle Name" value={tenantData.middleName} onChange={handleTenantChange} className="register-input" required />
              <input type="text" name="surname" placeholder="Surname" value={tenantData.surname} onChange={handleTenantChange} className="register-input" required />
            </div>

            <div className="register-form-row">
              <select name="civilStatus" value={tenantData.civilStatus} onChange={handleTenantChange} className="register-input" required>
                <option value="">Civil Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
              <select name="gender" value={tenantData.gender} onChange={handleTenantChange} className="register-input" required>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="date" name="birthdate" placeholder="Birthdate" value={tenantData.birthdate} onChange={handleTenantChange} className="register-input" required />
            </div>

            <div className="register-form-row">
              <input type="text" name="street" placeholder="Street/Sitio" value={tenantData.street} onChange={handleTenantChange} className="register-input" required />
              <input type="text" name="barangay" placeholder="Barangay" value={tenantData.barangay} onChange={handleTenantChange} className="register-input" required />
              <input type="text" name="city" placeholder="City/Municipality" value={tenantData.city} onChange={handleTenantChange} className="register-input" required />
              <input type="text" name="province" placeholder="Province" value={tenantData.province} onChange={handleTenantChange} className="register-input" required />
            </div>

            <div className="register-form-row">
              <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={tenantData.mobileNumber} onChange={handleTenantChange} className="register-input" required />
            </div>

            <div className="register-occupation-group">
              <label className="register-radio-label">
                <input type="radio" name="occupationType" value="student" checked={tenantData.occupationType === 'student'} onChange={handleTenantChange} required />
                <span className="register-radio-circle"></span>
                Student
              </label>
              <label className="register-radio-label">
                <input type="radio" name="occupationType" value="professional" checked={tenantData.occupationType === 'professional'} onChange={handleTenantChange} />
                <span className="register-radio-circle"></span>
                Professional
              </label>
              <label className="register-radio-label">
                <input type="radio" name="occupationType" value="others" checked={tenantData.occupationType === 'others'} onChange={handleTenantChange} />
                <span className="register-radio-circle"></span>
                Others
              </label>
            </div>

            <div className="register-divider"></div>

            <div className="register-form-row">
              <input type="email" name="email" placeholder="Email Address" value={tenantData.email} onChange={handleTenantChange} className="register-input" required />
              <div className="register-input-group register-password-group">
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={tenantData.password} onChange={handleTenantChange} className="register-input" required />
                <span className="register-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </span>
              </div>
              <div className="register-input-group register-password-group">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={tenantData.confirmPassword} onChange={handleTenantChange} className="register-input" required />
                <span className="register-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="register-button-group">
              <button type="button" className="register-back-button" onClick={onNavigateToLogin}>Back to Login</button>
              <div className="register-privacy-group" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <label className="register-privacy-label" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} style={{marginRight: '8px'}} />
                  I agree to the <a href="https://www.privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer" style={{marginLeft: '4px'}}>Data Privacy Act</a>
                </label>
              </div>
              <button type="submit" className="register-submit-button" disabled={!privacyChecked}>Submit</button>
            </div>
          </form>
          </>
        ) : (
          <>
            <h2 className="register-title">Landlord Registration</h2>
            
            {error && <div className="register-error-message">{error}</div>}
        
          <form onSubmit={handleLandlordSubmit}>
          <div className="register-form-row">
            <input type="text" name="firstName" placeholder="First Name" value={landlordData.firstName} onChange={handleLandlordChange} className="register-input" required />
            <input type="text" name="middleName" placeholder="Middle Name" value={landlordData.middleName} onChange={handleLandlordChange} className="register-input" required />
            <input type="text" name="surname" placeholder="Surname" value={landlordData.surname} onChange={handleLandlordChange} className="register-input" required />
          </div>

          <div className="register-form-row">
            <select name="civilStatus" value={landlordData.civilStatus} onChange={handleLandlordChange} className="register-input" required>
              <option value="">Civil Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
            <select name="gender" value={landlordData.gender} onChange={handleLandlordChange} className="register-input" required>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" name="birthdate" placeholder="Birthdate" value={landlordData.birthdate} onChange={handleLandlordChange} className="register-input" required />
          </div>

          <div className="register-form-row">
            <input type="text" name="street" placeholder="Street/Sitio" value={landlordData.street} onChange={handleLandlordChange} className="register-input" required />
            <input type="text" name="barangay" placeholder="Barangay" value={landlordData.barangay} onChange={handleLandlordChange} className="register-input" required />
            <input type="text" name="city" placeholder="City/Municipality" value={landlordData.city} onChange={handleLandlordChange} className="register-input" required />
            <input type="text" name="province" placeholder="Province" value={landlordData.province} onChange={handleLandlordChange} className="register-input" required />
          </div>

          <div className="register-form-row">
            <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={landlordData.mobileNumber} onChange={handleLandlordChange} className="register-input" required />
          </div>

          <div className="register-section-title">Boarding House Information</div>

          <div className="register-form-row">
            <input type="text" name="boardingHouseName" placeholder="Name of Boarding House" value={landlordData.boardingHouseName} onChange={handleLandlordChange} className="register-input register-full-width" required />
          </div>

          <div className="register-form-row">
            <input type="text" name="bhStreet" placeholder="Street/Sitio" value={landlordData.bhStreet} onChange={handleLandlordChange} className="register-input" required />
            <select name="bhBarangay" value={landlordData.bhBarangay} onChange={handleLandlordChange} className="register-input" required>
              <option value="">Select Barangay</option>
              <option value="Barangay 1">Barangay 1</option>
              <option value="Barangay 2">Barangay 2</option>
              <option value="Barangay 3">Barangay 3</option>
              <option value="Barangay 4">Barangay 4</option>
              <option value="Barangay 5">Barangay 5</option>
              <option value="Barangay 6">Barangay 6</option>
              <option value="Barangay 7">Barangay 7</option>
              <option value="Barangay 8">Barangay 8</option>
              <option value="Barangay 9">Barangay 9</option>
            </select>
            <input type="text" name="bhCity" value="Isabela" className="register-input" disabled />
            <input type="text" name="bhProvince" value="Negros Occidental" className="register-input" disabled />
          </div>

          <div className="register-divider"></div>

          <div className="register-form-row">
            <input type="email" name="email" placeholder="Email Address" value={landlordData.email} onChange={handleLandlordChange} className="register-input" required />
            <div className="register-input-group register-password-group">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={landlordData.password} onChange={handleLandlordChange} className="register-input" required />
              <span className="register-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </span>
            </div>
            <div className="register-input-group register-password-group">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={landlordData.confirmPassword} onChange={handleLandlordChange} className="register-input" required />
              <span className="register-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="register-button-group">
            <button type="button" className="register-back-button" onClick={onNavigateToLogin}>Back to Login</button>
            <div className="register-privacy-group" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <label className="register-privacy-label" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} style={{marginRight: '8px'}} />
                I agree to the <a href="https://www.privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer" style={{marginLeft: '4px'}}>Data Privacy Act</a>
              </label>
            </div>
            <button type="submit" className="register-submit-button" disabled={!privacyChecked}>Submit</button>
          </div>
        </form>
        </>
        )}
      </div>
      
      {showSuccess && (
        <div className="register-success-overlay">
          <div className="register-success-animation">
            <svg className="register-checkmark" viewBox="0 0 52 52">
              <circle className="register-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="register-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <p className="register-success-text">Registration Successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
      