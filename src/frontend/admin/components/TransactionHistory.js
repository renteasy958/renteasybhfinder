

import React, { useEffect, useState } from 'react';
import '../styles/transactionhistory.css';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const sampleTransactions = [
  {
	id: '1',
	type: 'tenant_payment',
	user: 'Juan Dela Cruz',
	date: '2026-01-10',
	amount: 2500,
	status: 'Completed',
  },
  {
	id: '2',
	type: 'verification_payment',
	user: 'Landlord Maria',
	date: '2026-01-11',
	amount: 500,
	status: 'Pending',
  },
];

const TransactionHistory = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				// Fetch tenant payments from reservations
				const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
				const tenantPayments = reservationsSnapshot.docs.map(doc => {
					const data = doc.data();
					return {
						id: doc.id,
						type: 'tenant_payment',
						user: data.tenantName || data.tenantId || '',
						date: data.date || '',
						amount: 50, // Always 50 per reservation
						status: data.status || 'Completed',
					};
				});

				// Fetch landlord verification payments from verificationRequests
				const verificationSnapshot = await getDocs(collection(db, 'verificationRequests'));
				const landlordPayments = verificationSnapshot.docs.map(doc => {
					const data = doc.data();
					return {
						id: doc.id,
						type: 'verification_payment',
						user: data.name || data.userId || '',
						date: data.date || '',
						amount: 300, // fixed verification fee
						status: 'Pending',
					};
				});

				const allTransactions = [...tenantPayments, ...landlordPayments];
				setTransactions(allTransactions);
			} catch (error) {
				console.error('Error fetching transactions:', error);
				setTransactions([]);
			} finally {
				setLoading(false);
			}
		};
		fetchTransactions();
	}, []);

	return (
		<div className="admin-page transaction-history-page">
			<div className="admin-cards-list">
				<div className="admin-card admin-card-header" style={{fontWeight:'bold',background:'#f3f4f6'}}>
					<span className="admin-card-title">Type</span>
					<span className="admin-card-type">User</span>
					<span className="admin-card-date">Date</span>
					<span className="admin-card-amount">Amount</span>
					<span className="admin-card-status">Status</span>
				</div>
				{loading ? (
					<p style={{textAlign: 'center', width: '100%'}}>Loading...</p>
				) : transactions.length === 0 ? (
					<p style={{textAlign: 'center', width: '100%'}}>No transaction history found</p>
				) : (
					transactions.map((item) => (
						<div key={item.id} className="admin-card">
							<span className="admin-card-title">
								{item.type === 'tenant_payment' || item.category === 'tenant_payment' ? 'Tenant Payment' :
								 item.type === 'verification_payment' || item.category === 'verification_payment' ? 'Landlord Verification Payment' :
								 item.transaction || item.type}
							</span>
							<span className="admin-card-type">{item.user || item.userId || item.tenantName || item.landlordName}</span>
							<span className="admin-card-date">{item.date}</span>
							<span className="admin-card-amount">{item.amount ? `₱${item.amount}` : ''}</span>
							<span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>{item.status}</span>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TransactionHistory;
