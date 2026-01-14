import React, { useState, useEffect } from 'react';
import '../styles/verification.css';
import { db } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const Verification = () => {
	const [requests, setRequests] = useState([]);
	const [selected, setSelected] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchRequests = async () => {
			setLoading(true);
			try {
				const querySnapshot = await getDocs(collection(db, 'verificationRequests'));
				const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				// Only show requests that are not approved or rejected
				const pending = data.filter(r => !r.status || r.status === 'pending');
				setRequests(pending);
			} finally {
				setLoading(false);
			}
		};
		fetchRequests();
	}, []);

	const handleApprove = async () => {
		if (!selected) return;
		setError('');
		try {
			// Update landlord in 'users' collection (main user profile)
			const landlordUserId = selected.userId || selected.uid || selected.landlordId || selected.id;
			const landlordUserRef = doc(db, 'users', landlordUserId);
			await updateDoc(landlordUserRef, { isVerified: true, status: 'verified' });

			// Optionally update in 'landlords' collection if you use it
			// const landlordRef = doc(db, 'landlords', landlordUserId);
			// await updateDoc(landlordRef, { isVerified: true, status: 'verified' });

			await updateDoc(doc(db, 'verificationRequests', selected.id), { status: 'approved' });
			setRequests(prev => prev.filter(r => r.id !== selected.id));
			setSelected(null);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleReject = async () => {
		if (!selected) return;
		setError('');
		try {
			await updateDoc(doc(db, 'verificationRequests', selected.id), { status: 'rejected' });
			setRequests(prev => prev.filter(r => r.id !== selected.id));
			setSelected(null);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="verification-page">
			<h2>Landlord Verification Requests</h2>
			{loading ? <div>Loading...</div> : null}
			{error && <div style={{color:'red',marginBottom:'12px'}}>{error}</div>}
			<div className="verification-cards">
				{requests.map(req => (
					<div className="verification-card" key={req.id} onClick={() => setSelected(req)}>
						<div className="verification-card-name">{req.name}</div>
					</div>
				))}
			</div>
			{selected && (
				<div className="verification-modal-overlay" onClick={() => setSelected(null)}>
					<div className="verification-modal" onClick={e => e.stopPropagation()}>
						<button className="verification-modal-close" onClick={() => setSelected(null)}>&times;</button>
						<h3 style={{textAlign: 'left'}}>Tenant Information</h3>
						<div style={{textAlign: 'left'}}><strong>Name:</strong> {selected.name || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Address:</strong> {selected.address || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Age:</strong> {selected.age || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Gender:</strong> {selected.gender || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Birthdate:</strong> {selected.birthdate || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Civil Status:</strong> {selected.civilStatus || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Boarding House Name:</strong> {selected.boardingHouseName || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Boarding House Address:</strong> {selected.boardingHouseAddress || 'N/A'}</div>
						<div style={{textAlign: 'left'}}><strong>Reference Number:</strong> {selected.referenceNumber || 'N/A'}</div>
						<div style={{marginTop: '24px', display: 'flex', gap: '16px'}}>
							<button className="verification-modal-approve" onClick={handleApprove}>Approve</button>
							<button className="verification-modal-reject" onClick={handleReject}>Reject</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Verification;
