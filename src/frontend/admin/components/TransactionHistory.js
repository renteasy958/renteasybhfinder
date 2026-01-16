

import React, { useEffect, useState } from 'react';
import '../styles/transactionhistory.css';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where, deleteDoc, doc as firestoreDoc } from 'firebase/firestore';

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
	const [filterType, setFilterType] = useState('all');

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
						user: data.tenantName || data.name || data.tenantId || '',
						date: data.date || '',
						amount: 50, // Always 50 per reservation
						status: data.status || 'Completed',
						refNumber: data.refNumber || '',
					};
				});

				// Fetch landlord verification payments from verificationRequests
				const verificationSnapshot = await getDocs(collection(db, 'verificationRequests'));
				const landlordPayments = verificationSnapshot.docs.map(doc => {
					const data = doc.data();
					return {
						id: doc.id,
						type: 'verification_payment',
						user: data.name || '',
						date: data.date || '',
						amount: 300, // fixed verification fee
						status: data.status === 'approved' ? 'Completed' : (data.status === 'rejected' ? 'Rejected' : 'Pending'),
						refNumber: data.referenceNumber || '',
					};
				});

				// Fetch landlord withdrawal requests from 'requests' collection
				const requestsSnapshot = await getDocs(
					query(collection(db, 'requests'))
				);
				const withdrawalTransactions = requestsSnapshot.docs
					.map(doc => {
						const data = doc.data();
						if (data.label === 'Landlord' && data.request === 'Withdrawal Request') {
							return {
								id: doc.id,
								type: 'landlord_withdrawal',
								user: data.name || data.user || data.userId || '',
								date: data.date && data.date.toDate ? data.date.toDate() : (data.date || ''),
								amount: data.amount,
								status: data.status || 'Pending',
								refNumber: data.refNumber || '',
							};
						} else if (data.label === 'Tenant' && data.request === 'Refund') {
							return {
								id: doc.id,
								type: 'tenant_withdrawal',
								user: data.tenantName || data.name || data.user || '',
								date: data.date && data.date.toDate ? data.date.toDate() : (data.date || ''),
								amount: data.amount,
								status: data.status || 'Pending',
								refNumber: data.refNumber || '',
							};
						}
						return null;
					})
					.filter(Boolean);

				// Sort by date/time ascending for balance calculation
				let sortedTransactions = [...tenantPayments, ...landlordPayments, ...withdrawalTransactions].sort((a, b) => {
					const dateA = a.date instanceof Date ? a.date : new Date(a.date);
					const dateB = b.date instanceof Date ? b.date : new Date(b.date);
					return dateA - dateB;
				});

				// Calculate cumulative balance
				let balance = 0;
				sortedTransactions = sortedTransactions.map(transaction => {
					if (transaction.type === 'tenant_payment') {
						balance += 50;
					} else if (transaction.type === 'verification_payment') {
						balance += 300;
					} else if (transaction.type === 'landlord_withdrawal' || transaction.type === 'tenant_withdrawal') {
						balance -= transaction.amount;
					}
					return { ...transaction, balance };
				});

				// Sort descending for display (most recent first)
				const allTransactions = sortedTransactions.sort((a, b) => {
					const dateA = a.date instanceof Date ? a.date : new Date(a.date);
					const dateB = b.date instanceof Date ? b.date : new Date(b.date);
					return dateB - dateA;
				});
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
			<div className="transaction-filters">
				<button className={`filter-btn${filterType === 'all' ? ' active' : ''}`} onClick={() => setFilterType('all')}>All</button>
				<button className={`filter-btn${filterType === 'landlord_withdrawal' ? ' active' : ''}`} onClick={() => setFilterType('landlord_withdrawal')}>Landlord Withdrawal</button>
				<button className={`filter-btn${filterType === 'tenant_withdrawal' ? ' active' : ''}`} onClick={() => setFilterType('tenant_withdrawal')}>Tenant Withdrawal</button>
				<button className={`filter-btn${filterType === 'verification_payment' ? ' active' : ''}`} onClick={() => setFilterType('verification_payment')}>Verification Payment</button>
				<button className={`filter-btn${filterType === 'tenant_payment' ? ' active' : ''}`} onClick={() => setFilterType('tenant_payment')}>Tenant Payment</button>
				<div className="balance-summary">
					<span>Total Balance: ₱{transactions.length > 0 ? transactions[0].balance : 0}</span>
				</div>
			</div>
			<div className="admin-cards-list">
				<div className="admin-card admin-card-header" style={{fontWeight:'bold',background:'#f3f4f6'}}>
					<span className="admin-card-title">Type</span>
					<span className="admin-card-type">User</span>
					<span className="admin-card-date">Date</span>
					<span className="admin-card-amount">Amount</span>
					<span className="admin-card-status">Status</span>
					<span className="admin-card-reference">Reference</span>
				</div>
				{loading ? (
					<p style={{textAlign: 'center', width: '100%'}}>Loading...</p>
				) : transactions.length === 0 ? (
					<p style={{textAlign: 'center', width: '100%'}}>No transaction history found</p>
				) : (
					transactions.filter(item => filterType === 'all' || item.type === filterType).map((item) => (
										<div key={item.id} className="admin-card">
												<span className="admin-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
													{item.type === 'tenant_payment' || item.category === 'tenant_payment' ? 'Tenant Payment' :
														item.type === 'verification_payment' || item.category === 'verification_payment' ? 'Landlord Verification Payment' :
														item.type === 'landlord_withdrawal' ? 'Landlord Withdrawal' :
														item.type === 'tenant_withdrawal' ? 'Tenant Withdrawal' :
														item.transaction || item.type}
												</span>
							<span className="admin-card-type">{item.user}</span>
														<span className="admin-card-date">{
															item.date instanceof Date
																? item.date.toLocaleString()
																: item.date
														}</span>
							<span className="admin-card-amount">{item.amount ? `₱${item.amount}` : ''}</span>
														<span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>
															{item.status}
														</span>
														<span className="admin-card-reference">{item.refNumber || ''}</span>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TransactionHistory;
