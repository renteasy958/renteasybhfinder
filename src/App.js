import React, { useState } from 'react';
import './App.css';
import Login from './frontend/login/login';
import Register from './registration/register';
import Home from './frontend/tenant/components/home';
import Liked from './frontend/tenant/components/liked';
import SearchResults from './frontend/tenant/components/searchresults';
import BHDetails from './frontend/tenant/components/bhdetails';
// ...existing code...
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
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  if (userData && userData.userType) {
    if (userData.userType === 'admin') return 'admindashboard';
    if (userData.userType === 'landlord') return 'llhome';
    if (userData.userType === 'tenant') return 'home';
  }
  return 'login';
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBHId, setSelectedBHId] = useState(null);
  // Store all houses for search
  const [allHouses, setAllHouses] = useState([]);

  // Fetch all houses once for search
  React.useEffect(() => {
    async function fetchAllHouses() {
      try {
        const { db } = await import('./firebase/config');
        const { collection, getDocs } = await import('firebase/firestore');
        const querySnapshot = await getDocs(collection(db, 'boardingHouses'));
        const houses = [];
        querySnapshot.forEach((doc) => {
          houses.push({ id: doc.id, ...doc.data() });
        });
        setAllHouses(houses);
        localStorage.setItem('boardingHouses', JSON.stringify(houses));
      } catch (error) {
        console.error('Error fetching all boarding houses:', error);
      }
    }
    fetchAllHouses();
  }, []);
  // const [showLLVerifyModal, setShowLLVerifyModal] = useState(false);

  // Always redirect to correct dashboard after refresh
  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    console.log('App.js useEffect - userData:', userData);
    console.log('App.js useEffect - currentPage:', currentPage);
    
    if (userData && userData.userType) {
      // Only redirect if not already on a valid page for this user type
      const adminPages = ['admindashboard'];
      const landlordPages = ['llhome', 'llreservations', 'addbh', 'llhistory', 'llprofile'];
      const tenantPages = ['home', 'liked', 'searchresults', 'bhdetails', 'profile', 'history'];
      
      if (userData.userType === 'admin' && !adminPages.includes(currentPage)) {
        console.log('Redirecting to admindashboard');
        setCurrentPage('admindashboard');
      } else if (userData.userType === 'landlord' && !landlordPages.includes(currentPage)) {
        console.log('Redirecting to llhome');
        setCurrentPage('llhome');
      } else if (userData.userType === 'tenant' && !tenantPages.includes(currentPage)) {
        console.log('Redirecting to home');
        setCurrentPage('home');
      }
    } else if (!userData && currentPage !== 'login' && currentPage !== 'register') {
      console.log('No userData found, redirecting to login');
      setCurrentPage('login');
    }
  }, [currentPage]);

  return (
    <div className="App">
      {currentPage === 'login' && <Login onNavigateToRegister={() => setCurrentPage('register')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} onNavigateToAdmin={() => setCurrentPage('admindashboard')} />}
      {currentPage === 'register' && <Register onNavigateToLogin={() => setCurrentPage('login')} onNavigateToHome={() => setCurrentPage('home')} onNavigateToLLHome={() => setCurrentPage('llhome')} />}
      {currentPage === 'home' && <Home onNavigateToBHDetails={(id) => { setSelectedBHId(id); setCurrentPage('bhdetails'); }} onNavigate={(page) => setCurrentPage(page)} onSearchResults={(results) => { setSearchResults(results); setCurrentPage('searchresults'); }} currentPage={currentPage} />}
      {currentPage === 'liked' && <Liked onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} onSearch={results => { setSearchResults(results); setCurrentPage('searchresults'); }} />}
      {currentPage === 'searchresults' && <SearchResults results={searchResults} onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'bhdetails' && <BHDetails bhId={selectedBHId || localStorage.getItem('selectedBHId')} onNavigateBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'liked' && <Liked onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'profile' && <Profile onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />}
      {currentPage === 'llhome' && <LLHome onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llreservations' && <LLReservations onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'addbh' && <AddBH onNavigate={(page) => setCurrentPage(page)} />}
      {currentPage === 'llhistory' && <LLHistory onNavigate={(page) => setCurrentPage(page)} />}
      {/* Removed LLSettings and llverify modal navigation, handled in navbar dropdown */}
      {currentPage === 'history' && (
        <History 
          onNavigate={(page) => setCurrentPage(page)} 
          currentPage={currentPage} 
          userId={(() => {
            const userData = JSON.parse(localStorage.getItem('userData') || 'null');
            return userData && (userData.uid || userData.id) ? (userData.uid || userData.id) : '';
          })()}
        />
      )}
      {/* No settings page, handled in navbar dropdown. Removed all LLSettings references. */}
      {currentPage === 'llprofile' && <LLProfile onNavigate={(page) => setCurrentPage(page)} />}
      {/* LLVerifyModal removed */}
      {currentPage === 'admindashboard' && <AdminDashboard />}
    </div>
  );
}

export default App;
