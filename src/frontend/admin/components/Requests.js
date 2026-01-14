import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import '../styles/requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tenant');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'requests'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(reqs);
      } catch (err) {
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleCardClick = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteDoc(doc(db, 'requests', id));
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete request.');
    }
  };

  const filtered = requests.filter(item => {
    if (activeTab === 'Tenant') {
      return item.label === 'Tenant' && item.request === 'Refund';
    } else if (activeTab === 'Landlord') {
      return item.label === 'Landlord' && item.request === 'Withdrawal Request';
    }
    return false;
  });

  return (
    <div className="admin-page">
      <div className="requests-tabs">
        <button className={`requests-tab${activeTab === 'Tenant' ? ' active' : ''}`} onClick={() => setActiveTab('Tenant')}>Tenant</button>
        <button className={`requests-tab${activeTab === 'Landlord' ? ' active' : ''}`} onClick={() => setActiveTab('Landlord')}>Landlord</button>
      </div>
      <div className="admin-cards-list">
        {loading ? (
          <p style={{textAlign: 'center', width: '100%'}}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{textAlign: 'center', width: '100%'}}>No requests found</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="admin-card">
              <span className="admin-card-title">{item.request}</span>
              <span className="admin-card-type">{item.user}</span>
              <span className="admin-card-date">{item.date && item.date.toDate ? item.date.toDate().toLocaleString() : ''}</span>
              <span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>{item.status}</span>
            </div>
          ))
        )}
      </div>
      {showModal && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-requests" onClick={e => e.stopPropagation()}>
            <h2>Request Details</h2>
            <div><b>Type:</b> {selected.request}</div>
            <div><b>User:</b> {selected.user}</div>
            <div><b>Amount:</b> {selected.amount}</div>
            <div><b>Status:</b> {selected.status}</div>
            <div><b>Date:</b> {selected.date && selected.date.toDate ? selected.date.toDate().toLocaleString() : ''}</div>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
