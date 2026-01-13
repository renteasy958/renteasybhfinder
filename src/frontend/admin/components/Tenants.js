
import React, { useState, useEffect } from 'react';
import '../styles/tenants.css';

import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Tenants = () => {
	const [tenants, setTenants] = useState([]);
	const [selectedTenant, setSelectedTenant] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTenants = async () => {
			try {
				const tenantsQuery = query(collection(db, 'users'), where('userType', '==', 'tenant'));
				const querySnapshot = await getDocs(tenantsQuery);
				const tenantsList = [];
				querySnapshot.forEach((doc) => {
					tenantsList.push({ id: doc.id, ...doc.data() });
				});
				setTenants(tenantsList);
			} catch (error) {
				console.error('Error fetching tenants:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchTenants();
	}, []);


	const handleCardClick = (tenant) => {
		setSelectedTenant(tenant);
	};

	const closeModal = () => {
		setSelectedTenant(null);
	};

	return (
		<div className="admin-page">
			<div className="admin-cards-list">
				{loading ? (
					<p style={{textAlign: 'center', width: '100%'}}>Loading tenants...</p>
				) : tenants.length === 0 ? (
					<p style={{textAlign: 'center', width: '100%'}}>No tenants found</p>
				) : (
					tenants.map((item) => {
						const fullName = [item.firstName, item.middleName, item.surname].filter(Boolean).join(' ');
						return (
							<div key={item.id} className="admin-card" onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
								<span className="admin-card-title">{fullName || item.email || 'Unnamed Tenant'}</span>
							</div>
						);
					})
				)}
			</div>

			{selectedTenant && (
				<div className="modal-overlay-tenant" onClick={closeModal}>
					<div className="modal-content-tenant" onClick={e => e.stopPropagation()}>
						<h2 className="modal-title-tenant">Tenant Details</h2>
						<div className="modal-details-tenant">
							<div><strong>First Name:</strong> {selectedTenant.firstName || ''}</div>
							<div><strong>Middle Name:</strong> {selectedTenant.middleName || ''}</div>
							<div><strong>Surname:</strong> {selectedTenant.surname || ''}</div>
							<div><strong>Civil Status:</strong> {selectedTenant.civilStatus || ''}</div>
							<div><strong>Gender:</strong> {selectedTenant.gender || ''}</div>
							<div><strong>Birthdate:</strong> {selectedTenant.birthdate || ''}</div>
							<div><strong>Email:</strong> {selectedTenant.email || ''}</div>
							<div><strong>Mobile Number:</strong> {selectedTenant.mobileNumber || ''}</div>
							<div><strong>Occupation Type:</strong> {selectedTenant.occupationType || ''}</div>
							<div><strong>Address:</strong> {
								selectedTenant.address
									? [selectedTenant.address.street, selectedTenant.address.barangay, selectedTenant.address.city, selectedTenant.address.province].filter(Boolean).join(', ')
									: ''
							}</div>
						</div>
						<button className="modal-close-btn-tenant" onClick={closeModal}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Tenants;
