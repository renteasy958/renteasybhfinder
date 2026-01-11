import React from 'react';
import '../styles/transactionhistory.css';

const sampleData = [
	{ id: 1, transaction: 'Payment', user: 'Juan Dela Cruz', date: '2026-01-10', amount: '₱1,200.00', status: 'Completed' },
	{ id: 2, transaction: 'Refund', user: 'Maria Santos', date: '2026-01-09', amount: '₱500.00', status: 'Completed' },
];

const TransactionHistory = () => (
	<div className="admin-page transaction-history-page">
		<div className="admin-cards-list">
					{sampleData.map((item) => (
						<div key={item.id} className="admin-card">
							<span className="admin-card-title">{item.transaction}</span>
							<span className="admin-card-type">{item.user}</span>
							<span className="admin-card-date">{item.date}</span>
							{item.amount && <span className="admin-card-amount">{item.amount}</span>}
							<span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>{item.status}</span>
						</div>
					))}
		</div>
	</div>
);

export default TransactionHistory;
