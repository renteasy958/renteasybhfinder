
import React, { useState, useEffect } from 'react';
import '../styles/landlords.css';

import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Landlords = () => {
	const [landlords, setLandlords] = useState([]);
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLandlords = async () => {
			try {
				const landlordsQuery = query(collection(db, 'users'), where('userType', '==', 'landlord'));
				const querySnapshot = await getDocs(landlordsQuery);
				const landlordsList = [];
				querySnapshot.forEach((doc) => {
					landlordsList.push({ id: doc.id, ...doc.data() });
				});
				setLandlords(landlordsList);
			} catch (error) {
				console.error('Error fetching landlords:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchLandlords();
	}, []);

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
				{loading ? (
					<p style={{textAlign: 'center', width: '100%'}}>Loading landlords...</p>
				) : landlords.length === 0 ? (
					<p style={{textAlign: 'center', width: '100%'}}>No landlords found</p>
				) : (
					landlords.map((item) => {
						const fullName = [item.firstName, item.middleName, item.surname].filter(Boolean).join(' ');
						return (
							<div key={item.id} className="admin-card" onClick={() => handleCardClick(item)} style={{cursor: 'pointer'}}>
								<span className="admin-card-title">{fullName || item.email || 'Unnamed Landlord'}</span>
								<span className="admin-card-type">{item.boardingHouse?.name || ''}</span>
							</div>
						);
					})
				)}
			</div>
			{showModal && selected && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content-landlord" onClick={e => e.stopPropagation()}>
						<button className="modal-close" onClick={closeModal}>×</button>
						<div className="modal-landlord-layout">
							<div className="modal-landlord-details">
								<h3>Landlord Details</h3>
								<div className="modal-info-row"><span className="modal-label">First Name:</span> {selected.firstName || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Middle Name:</span> {selected.middleName || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Surname:</span> {selected.surname || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Email:</span> {selected.email || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Civil Status:</span> {selected.civilStatus || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Gender:</span> {selected.gender || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Birthdate:</span> {selected.birthdate || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Mobile Number:</span> {selected.mobileNumber || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Status:</span> {selected.status === 'verified' ? 'Verified' : 'Not Verified'}</div>
							</div>
							<div className="modal-bh-details">
								<h3>Boarding House Details</h3>
								<div className="modal-info-row"><span className="modal-label">Name:</span> {selected.boardingHouse?.name || ''}</div>
								<div className="modal-info-row"><span className="modal-label">Address:</span> {
									selected.boardingHouse?.address
										? [selected.boardingHouse.address.street, selected.boardingHouse.address.barangay, selected.boardingHouse.address.city, selected.boardingHouse.address.province].filter(Boolean).join(', ')
										: ''
								}</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Landlords;
