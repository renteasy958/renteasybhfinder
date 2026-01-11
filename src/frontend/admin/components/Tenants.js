
import React, { useState } from 'react';
import '../styles/tenants.css';

const sampleData = [
	{
		id: 1,
		name: 'Maria Santos',
		email: 'maria@email.com',
		phone: '09171234567',
		address: '123 Main St, Quezon City',
		gender: 'Female',
		birthday: '1998-05-10',
		civilStatus: 'Single',
		type: 'Student',
	},
	{
		id: 2,
		name: 'Ana Cruz',
		email: 'ana@email.com',
		phone: '09181234567',
		address: '456 Elm St, Manila',
		gender: 'Female',
		birthday: '1997-11-22',
		civilStatus: 'Married',
		type: 'Tenant',
	},
	{
		id: 3,
		name: 'John Dela Cruz',
		email: 'john@email.com',
		phone: '09191234567',
		address: '789 Pine St, Makati',
		gender: 'Male',
		birthday: '1996-03-15',
		civilStatus: 'Single',
		type: 'Student',
	},
];

const Tenants = () => {
	const [selectedTenant, setSelectedTenant] = useState(null);

	const handleCardClick = (tenant) => {
		setSelectedTenant(tenant);
	};

	const closeModal = () => {
		setSelectedTenant(null);
	};

	return (
		<div className="admin-page">
			<div className="admin-cards-list">
				{sampleData.map((item) => (
					<div key={item.id} className="admin-card" onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
						<span className="admin-card-title">{item.name}</span>
					</div>
				))}
			</div>

			{selectedTenant && (
				<div className="modal-overlay-tenant" onClick={closeModal}>
					<div className="modal-content-tenant" onClick={e => e.stopPropagation()}>
						<h2 className="modal-title-tenant">Tenant Details</h2>
									<div className="modal-details-tenant">
										<div><strong>Name:</strong> {selectedTenant.name}</div>
										<div><strong>Email:</strong> {selectedTenant.email}</div>
										<div><strong>Phone:</strong> {selectedTenant.phone}</div>
										<div><strong>Address:</strong> {selectedTenant.address}</div>
										<div><strong>Gender:</strong> {selectedTenant.gender}</div>
										<div><strong>Birthday:</strong> {selectedTenant.birthday}</div>
										<div><strong>Civil Status:</strong> {selectedTenant.civilStatus}</div>
										<div><strong>Type:</strong> {selectedTenant.type}</div>
									</div>
						<button className="modal-close-btn-tenant" onClick={closeModal}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Tenants;
