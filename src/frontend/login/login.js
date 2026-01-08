import React, { useState } from 'react';
import './login.css';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ onNavigateToRegister, onNavigateToHome }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('=== LOGIN FORM SUBMITTED ===');
    console.log('Email:', email);
    console.log('Password:', password);
    setError('');
    
    try {
      console.log('Attempting Firebase login...');
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful, user:', userCredential.user);
      
      // Get user document from Firestore to check userType
      console.log('Fetching user document from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      console.log('Firestore fetch complete');
      console.log('User doc exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User logged in:', userData);
        
        // Save user data to localStorage for profile page
        const userDataForStorage = {
          userType: userData.userType,
          firstName: userData.firstName,
          middleName: userData.middleName,
          surname: userData.surname,
          civilStatus: userData.civilStatus,
          gender: userData.gender,
          birthdate: userData.birthdate,
          street: userData.address?.street || userData.street,
          barangay: userData.address?.barangay || userData.barangay,
          city: userData.address?.city || userData.city,
          province: userData.address?.province || userData.province,
          mobileNumber: userData.mobileNumber,
          occupationType: userData.occupationType,
          email: userData.email
        };
        localStorage.setItem('userData', JSON.stringify(userDataForStorage));
        
        // Redirect to home (tenant page) regardless of userType
        console.log('Redirecting to home...');
        onNavigateToHome();
      } else {
        console.log('User data not found in Firestore');
        setError('User data not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2 className="login-title">Welcome back</h2>
        
        {error && <div className="login-error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-input-group login-password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <span 
              className="login-eye-icon" 
              onClick={togglePasswordVisibility}
            >
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

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="signup-link">
            New here? <span className="login-signup-link" onClick={onNavigateToRegister}>Create an Account</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
