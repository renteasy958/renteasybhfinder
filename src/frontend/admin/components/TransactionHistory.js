import React from 'react';
import '../styles/transactionhistory.css';

// No sample transaction history
const sampleData = [];

const TransactionHistory = () => (
	<div className="admin-page transaction-history-page">
		<div className="admin-cards-list">
			{sampleData.length === 0 ? (
				<p style={{textAlign: 'center', width: '100%'}}>No transaction history found</p>
			) : (
				sampleData.map((item) => (
					<div key={item.id} className="admin-card">
						<span className="admin-card-title">{item.transaction}</span>
						<span className="admin-card-type">{item.user}</span>
						<span className="admin-card-date">{item.date}</span>
						{item.amount && <span className="admin-card-amount">{item.amount}</span>}
						<span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>{item.status}</span>
					</div>
				))
			)}
		</div>
	</div>
);

export default TransactionHistory;
