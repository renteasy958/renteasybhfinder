
import React, { useState } from 'react';
import '../styles/tenants.css';

// No sample tenants
const sampleData = [];

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
