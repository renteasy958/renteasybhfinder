import React, { useState, useEffect } from 'react';
import LLNavbar from './llnavbar';
import LLVerify from './llverify';
import '../styles/llhistory.css';
import '../../admin/styles/transactionhistory.css';


import { db } from '../../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LLHistory = ({ onNavigate }) => {
  const [historyData, setHistoryData] = useState([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const landlordId = userData.userId || userData.uid || userData.id || '';
        if (!landlordId) {
          setHistoryData([]);
          setLoading(false);
          return;
        }
        // Fetch withdrawal requests
        const withdrawalQ = query(
          collection(db, 'requests'),
          where('label', '==', 'Landlord'),
          where('request', '==', 'Withdrawal Request'),
          where('userId', '==', landlordId)
        );
        const withdrawalSnap = await getDocs(withdrawalQ);
        const withdrawals = withdrawalSnap.docs.map(doc => ({
          id: doc.id,
          type: 'Withdrawal',
          ...doc.data()
        }));

        // Fetch verification requests
        const verificationQ = query(
          collection(db, 'verificationRequests'),
          where('userId', '==', landlordId)
        );
        const verificationSnap = await getDocs(verificationQ);
        const verifications = verificationSnap.docs.map(doc => ({
          id: doc.id,
          type: 'Verification',
          ...doc.data()
        }));

        // Merge and sort by date (descending)
        const allHistory = [...withdrawals, ...verifications].sort((a, b) => {
          const dateA = a.date && a.date.toDate ? a.date.toDate() : (typeof a.date === 'object' && a.date.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date));
          const dateB = b.date && b.date.toDate ? b.date.toDate() : (typeof b.date === 'object' && b.date.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date));
          return dateB - dateA;
        });
        setHistoryData(allHistory);
      } catch (error) {
        console.error('Error fetching landlord history:', error);
        setHistoryData([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="admin-page transaction-history-page">
      <LLNavbar onNavigate={onNavigate} onShowVerifyModal={() => setShowVerifyModal(true)} />
      <LLVerify show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <div className="admin-cards-list">
        {loading ? (
          <div className="no-history"><p>Loading...</p></div>
        ) : historyData.length === 0 ? (
          <div className="no-history">
            <p>No history found</p>
          </div>
        ) : (
          historyData.map((item) => (
            <div key={item.id} className="admin-card">
              <span className="admin-card-title">{item.type}</span>
              <span className="admin-card-type">{
                item.type === 'Withdrawal' ? (item.gcashNumber || '-') : (item.referenceNumber || '-')
              }</span>
              <span className="admin-card-date">{
                item.date && item.date.toDate
                  ? item.date.toDate().toLocaleString()
                  : (typeof item.date === 'object' && item.date.seconds
                      ? new Date(item.date.seconds * 1000).toLocaleString()
                      : item.date || '-')
              }</span>
              {item.amount && item.type === 'Withdrawal' && <span className="admin-card-amount">₱{item.amount}</span>}
              <span className={
                item.status === 'Pending' ? 'admin-card-status pending' :
                item.status === 'Rejected' ? 'admin-card-status rejected' :
                'admin-card-status completed'
              }>{item.status || (item.type === 'Verification' ? 'Pending' : '')}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LLHistory;
