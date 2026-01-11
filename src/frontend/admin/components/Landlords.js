
import React, { useState } from 'react';
import '../styles/landlords.css';

const sampleData = [
	{
		id: 1,
		name: 'Juan Dela Cruz',
		email: 'juan@email.com',
		status: 'Verified',
		civilStatus: 'Single',
		gender: 'Male',
		birthdate: '1990-05-10',
		mobileNumber: '09171234567',
		address: '123 Main St, Barangay 1, Isabela, Negros Occidental',
		boardingHouse: {
			name: 'Sunrise Dormitory',
			address: '123 Main St, Barangay 1, Isabela, Negros Occidental',
		},
	},
	{
		id: 2,
		name: 'Pedro Reyes',
		email: 'pedro@email.com',
		status: 'Verified',
		civilStatus: 'Married',
		gender: 'Male',
		birthdate: '1985-11-22',
		mobileNumber: '09179876543',
		address: '456 Elm St, Barangay 2, Isabela, Negros Occidental',
		boardingHouse: {
			name: 'Blue House',
			address: '456 Elm St, Barangay 2, Isabela, Negros Occidental',
		},
	},
];

const Landlords = () => {
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const handleCardClick = (item) => {
		setSelected(item);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelected(null);
	};

	return (
		<div className="admin-page landlords-page">
			<div className="admin-cards-list">
				{sampleData.map((item) => (
					<div key={item.id} className="admin-card" onClick={() => handleCardClick(item)} style={{cursor: 'pointer'}}>
						<span className="admin-card-title">{item.name}</span>
						<span className="admin-card-type">{item.boardingHouse.name}</span>
						<span className="admin-card-status verified">{item.status}</span>
					</div>
				))}
			</div>
			{showModal && selected && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content-landlord" onClick={e => e.stopPropagation()}>
						<button className="modal-close" onClick={closeModal}>×</button>
						<div className="modal-landlord-layout">
							<div className="modal-landlord-details">
								<h3>Landlord Details</h3>
								<div className="modal-info-row"><span className="modal-label">Name:</span> {selected.name}</div>
								<div className="modal-info-row"><span className="modal-label">Email:</span> {selected.email}</div>
								<div className="modal-info-row"><span className="modal-label">Civil Status:</span> {selected.civilStatus}</div>
								<div className="modal-info-row"><span className="modal-label">Gender:</span> {selected.gender}</div>
								<div className="modal-info-row"><span className="modal-label">Birthdate:</span> {selected.birthdate}</div>
								<div className="modal-info-row"><span className="modal-label">Mobile Number:</span> {selected.mobileNumber}</div>
								<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.address}</div>
							</div>
							<div className="modal-bh-details">
								<h3>Boarding House Details</h3>
								<div className="modal-info-row"><span className="modal-label">Name:</span> {selected.boardingHouse.name}</div>
								<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.boardingHouse.address}</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Landlords;
