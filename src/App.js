import React, { useState } from 'react';
import './App.css';
import Login from './frontend/login/login';
import Register from './registration/register';
import Home from './frontend/tenant/components/home';
import SearchResults from './frontend/tenant/components/searchresults';
import BHDetails from './frontend/tenant/components/bhdetails';
import Liked from './frontend/tenant/components/liked';
import Profile from './frontend/tenant/components/profile';
import LLHome from './frontend/landlord/components/llhome';
import LLReservations from './frontend/landlord/components/llreservations';
import AddBH from './frontend/landlord/components/addbh';
import LLHistory from './frontend/landlord/components/llhistory';
import LLProfile from './frontend/landlord/components/llprofile';
import AdminDashboard from './frontend/admin/AdminDashboard';
// import LLSettings from './frontend/landlord/components/llsettings';
import History from './frontend/tenant/components/history';

function getInitialPage() {
  return 'login';
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [searchResults, setSearchResults] = useState([]);
  // const [showLLVerifyModal, setShowLLVerifyModal] = useState(false);

  // Keep currentPage in sync with user type for refresh persistence
  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (userData) {
      userData.lastPage = currentPage;
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [currentPage]);

  return (
    <div className="App">
      {currentPage === 'login' && <Login onNavigateToRegister={() => setCurrentPage('register')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} onNavigateToAdmin={() => setCurrentPage('admindashboard')} />}
      {currentPage === 'register' && <Register onNavigateToLogin={() => setCurrentPage('login')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} />}
      {currentPage === 'home' && <Home onNavigateToBHDetails={() => setCurrentPage('bhdetails')} onNavigate={(page) => setCurrentPage(page)} onSearchResults={(results) => { setSearchResults(results); setCurrentPage('searchresults'); }} currentPage={currentPage} />}
      {currentPage === 'searchresults' && <SearchResults results={searchResults} onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'bhdetails' && <BHDetails onNavigateBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'liked' && <Liked onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'profile' && <Profile onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'llhome' && <LLHome onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llreservations' && <LLReservations onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'addbh' && <AddBH onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llhistory' && <LLHistory onNavigate={(page) => setCurrentPage(page)} />}
      {/* Removed LLSettings and llverify modal navigation, handled in navbar dropdown */}
      {currentPage === 'history' && <History onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {/* No settings page, handled in navbar dropdown. Removed all LLSettings references. */}
      {currentPage === 'llprofile' && <LLProfile onNavigate={(page) => setCurrentPage(page)} />}
      {/* LLVerifyModal removed */}
      {currentPage === 'admindashboard' && <AdminDashboard />}
    </div>
  );
}

export default App;
