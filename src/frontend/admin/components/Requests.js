
import React, { useState } from 'react';
import '../styles/requests.css';

// No sample requests
const sampleData = [];


const Requests = () => {
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [refNumber, setRefNumber] = useState('');
	const [activeTab, setActiveTab] = useState('Tenant');

	const handleCardClick = (item) => {
		setSelected(item);
		setShowModal(true);
		setRefNumber('');
	};

	const closeModal = () => {
		setShowModal(false);
		setSelected(null);
		setRefNumber('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// handle submit logic here
		closeModal();
	};

		const filtered = sampleData.filter(item => {
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
				{filtered.length === 0 ? (
					<p style={{textAlign: 'center', width: '100%'}}>No requests found</p>
				) : (
					filtered.map((item) => (
						<div key={item.id} className="admin-card" onClick={() => handleCardClick(item)} style={{cursor: 'pointer'}}>
							<span className="admin-card-title">{item.request}</span>
							<span className="admin-card-type">{item.user}</span>
							<span className="admin-card-date">{item.date}</span>
							<span className={item.status === 'Pending' ? 'admin-card-status pending' : 'admin-card-status completed'}>{item.status}</span>
						</div>
					))
				)}
			</div>
			{showModal && selected && (
				<div className="modal-overlay" onClick={closeModal}>
					<form className="modal-content-requests" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
						<button className="modal-close" type="button" onClick={closeModal}>×</button>
						<h2>Transaction Details</h2>
						<div className="modal-info-row"><span className="modal-label">Type:</span> {selected.request}</div>
						<div className="modal-info-row"><span className="modal-label">Name:</span> {selected.user}</div>
						<div className="modal-info-row"><span className="modal-label">Label:</span> {selected.label}</div>
						<div className="modal-info-row"><span className="modal-label">Date Requested:</span> {selected.date}</div>
						<div className="modal-info-row"><span className="modal-label">Gcash Number:</span> {selected.gcash}</div>
						<div className="modal-info-row"><span className="modal-label">Amount:</span> {selected.amount}</div>
						<div className="modal-info-row"><span className="modal-label">Reference Number:</span>
							<input type="text" value={refNumber} onChange={e => setRefNumber(e.target.value)} placeholder="Enter reference number" className="modal-ref-input" />
						</div>
						<div className="modal-actions">
							<button className="modal-btn submit" type="submit">Submit</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default Requests;
