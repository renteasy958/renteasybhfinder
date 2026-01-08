import React, { useState } from 'react';
import './App.css';
import Login from './frontend/login/login';
import Register from './registration/register';
import Home from './frontend/tenant/components/home';
import BHDetails from './frontend/tenant/components/bhdetails';
import Liked from './frontend/tenant/components/liked';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div className="App">
      {currentPage === 'login' && <Login onNavigateToRegister={() => setCurrentPage('register')} onNavigateToHome={() => setCurrentPage('home')} />}
      {currentPage === 'register' && <Register onNavigateToLogin={() => setCurrentPage('login')} onNavigateToHome={() => setCurrentPage('home')} />}
      {currentPage === 'home' && <Home onNavigateToBHDetails={() => setCurrentPage('bhdetails')} onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'bhdetails' && <BHDetails onNavigateBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'liked' && <Liked onNavigate={(page) => setCurrentPage(page)} />}
    </div>
  );
}

export default App;
