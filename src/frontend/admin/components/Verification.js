
import React, { useState } from 'react';
import '../styles/verification.css';

const landlordRegistrations = [
	{
		id: 1,
		name: 'Juan Dela Cruz',
		civilStatus: 'Single',
		gender: 'Male',
		birthdate: '1990-05-10',
		address: {
			street: '123 Main St',
			barangay: 'Barangay 1',
			city: 'Isabela',
			province: 'Negros Occidental',
		},
		mobileNumber: '09171234567',
		email: 'juan.landlord@email.com',
		status: 'Not Verified',
		referenceNumber: 'REF-20260111-001',
	},
	{
		id: 2,
		name: 'Pedro Reyes',
		civilStatus: 'Married',
		gender: 'Male',
		birthdate: '1985-11-22',
		address: {
			street: '456 Elm St',
			barangay: 'Barangay 2',
			city: 'Isabela',
			province: 'Negros Occidental',
		},
		mobileNumber: '09179876543',
		email: 'pedro.landlord@email.com',
		status: 'Not Verified',
		referenceNumber: 'REF-20260111-002',
	},
];

const Verification = () => {
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [refNumber, setRefNumber] = useState('');

	const handleCardClick = (landlord) => {
		setSelected(landlord);
		setRefNumber(landlord.referenceNumber || '');
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelected(null);
		setRefNumber('');
	};

	return (
		<div className="admin-page">
			<div className="admin-cards-list">
				{landlordRegistrations.map((landlord) => (
								<div key={landlord.id} className="admin-card" onClick={() => handleCardClick(landlord)}>
									<span className="admin-card-title">{landlord.name}</span>
									<span className="admin-card-status not-verified">{landlord.status}</span>
								</div>
				))}
			</div>
					{showModal && selected && (
						<div className="modal-overlay" onClick={closeModal}>
							<div className="modal-content-verification" onClick={e => e.stopPropagation()}>
								<button className="modal-close" onClick={closeModal}>×</button>
								<h2>Landlord Information</h2>
								<div className="modal-info-row"><span className="modal-label">Name:</span> {selected.name}</div>
								<div className="modal-info-row"><span className="modal-label">Civil Status:</span> {selected.civilStatus}</div>
								<div className="modal-info-row"><span className="modal-label">Gender:</span> {selected.gender}</div>
								<div className="modal-info-row"><span className="modal-label">Birthdate:</span> {selected.birthdate}</div>
								<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.address.street}, {selected.address.barangay}, {selected.address.city}, {selected.address.province}</div>
								<div className="modal-info-row"><span className="modal-label">Mobile Number:</span> {selected.mobileNumber}</div>
								<div className="modal-info-row"><span className="modal-label">Email:</span> {selected.email}</div>
											<div className="modal-info-row"><span className="modal-label">Reference Number:</span>
												  <input type="text" value={refNumber} readOnly className="modal-ref-input" />
											</div>
											<div className="modal-actions">
												<button className="modal-btn reject">Reject</button>
												<button className="modal-btn approve">Approve</button>
											</div>
							</div>
						</div>
					)}
		</div>
	);
};

export default Verification;
