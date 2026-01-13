import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const Verification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'verificationRequests'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched verification requests:', data);
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  const approveLandlord = async (userId) => {
    if (!userId) return;
    // Try landlords collection first, fallback to users
    let landlordRef = doc(db, 'landlords', userId);
    let snap = await getDocs(collection(db, 'landlords'));
    let found = false;
    snap.forEach(docSnap => {
      if (docSnap.id === userId) found = true;
    });
    if (!found) {
      landlordRef = doc(db, 'users', userId);
    }
    await updateDoc(landlordRef, { isVerified: true });
    alert('Landlord approved and set as verified!');
  };

  useEffect(() => {
    setRequests([
      {
        id: 'sample123',
        name: 'Sample Landlord',
        date: '2026-01-12 12:00:00',
        referenceNumber: 'SAMPLE-REF-001',
        userId: 'sample-uid-001',
      }
    ]);
  }, []);

  return (
    <div className="verification-page">
      <h2>Landlord Verification Requests</h2>
      <button onClick={fetchRequests} style={{marginBottom:12}}>Refresh</button>
      <table className="verification-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Reference Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4}>Loading...</td></tr>
          ) : requests.length === 0 ? (
            <tr><td colSpan={4}>No verification requests found.</td></tr>
          ) : (
            requests.map(req => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.date}</td>
                <td>{req.referenceNumber}</td>
                <td>
                  <button onClick={() => approveLandlord(req.userId)}>Approve</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Verification;



