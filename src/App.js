import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './frontend/login/login';
import Register from './registration/register';
import Home from './frontend/tenant/components/home';
import BHDetails from './frontend/tenant/components/bhdetails';
import Liked from './frontend/tenant/components/liked';
import Profile from './frontend/tenant/components/profile';
import History from './frontend/tenant/components/history';
import LLHome from './frontend/landlord/components/llhome';
import LLReservations from './frontend/landlord/components/llreservations';
import AddBH from './frontend/landlord/components/addbh';
import LLHistory from './frontend/landlord/components/llhistory';
import AdminDashboard from './frontend/admin/components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'login';
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  return (
    <div className="App">
      {currentPage === 'login' && <Login onNavigateToRegister={() => setCurrentPage('register')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} onNavigateToAdmin={() => setCurrentPage('admin')} />}
      {currentPage === 'register' && <Register onNavigateToLogin={() => setCurrentPage('login')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} />}
      {currentPage === 'home' && <Home onNavigateToBHDetails={() => setCurrentPage('bhdetails')} onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'bhdetails' && <BHDetails onNavigateBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'liked' && <Liked onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'profile' && <Profile onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'history' && <History onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llhome' && <LLHome onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llreservations' && <LLReservations onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'addbh' && <AddBH onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llhistory' && <LLHistory onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'admin' && <AdminDashboard />}
    </div>
  );
}

export default App;
