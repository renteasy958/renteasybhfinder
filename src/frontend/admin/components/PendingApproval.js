import React, { useState, useEffect } from 'react';
import '../styles/pendingapproval.css';

import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const PendingApproval = () => {
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [pendingBH, setPendingBH] = useState([]);
	const [refresh, setRefresh] = useState(false);

	const handleCardClick = (bh) => {
		setSelected(bh);
		setShowModal(true);
	};
	const closeModal = () => {
		setShowModal(false);
		setSelected(null);
	};

	useEffect(() => {
		const fetchPending = async () => {
			const q = query(collection(db, 'boardingHouses'), where('status', '==', 'pending'));
			const querySnapshot = await getDocs(q);
			const houses = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Only push if name, type, and price are present
				if (data.name && data.type && data.price) {
					houses.push({ id: doc.id, ...data });
				}
			});
			setPendingBH(houses);
		};
		fetchPending();
	}, [refresh]);
	const handleApprove = async () => {
		if (!selected) return;
		try {
			const docRef = doc(db, 'boardingHouses', selected.id);
			await updateDoc(docRef, { status: 'approved' });
			setShowModal(false);
			setSelected(null);
			setRefresh(r => !r);
		} catch (error) {
			console.error('Error approving boarding house:', error);
		}
	};

	return (
		<div className="admin-page">
			<div className="bh-cards-list">
				<div className="card-row">
					{pendingBH.length === 0 ? (
						<p style={{textAlign: 'center', width: '100%'}}>No pending boarding houses found</p>
					) : (
						pendingBH.map((bh) => (
							<div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
								<div className="card-image-container" style={{backgroundImage: bh.images && bh.images[0] ? `url(${bh.images[0]})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
								<div className="card-content">
									<div className="card-name">{bh.name}</div>
									<div className="card-type">{bh.type}</div>
									<div className="card-price">{bh.price}</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
			{showModal && selected && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content-bh" onClick={e => e.stopPropagation()}>
						<button className="modal-close" onClick={closeModal}>×</button>
						<div className="modal-images">
							{selected.images && selected.images.map((img, idx) => (
								<img key={idx} src={img} alt="BH" className="modal-img" />
							))}
						</div>
						<div className="modal-details">
							<div className="modal-bh-name">{selected.name}</div>
							<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.sitio && selected.barangay && selected.municipality && selected.province ? `${selected.sitio}, ${selected.barangay}, ${selected.municipality}, ${selected.province}` : (selected.address || 'N/A')}</div>
							<div className="modal-info-row"><span className="modal-label">Type:</span> {selected.type}</div>
							<div className="modal-info-row"><span className="modal-label">Price:</span> <span className="modal-price">{selected.price}</span></div>
							<div className="modal-amenities">
								<div className="amenities-section">
									<div className="amenities-title">Included Amenities</div>
									<ul className="amenities-list">
										{selected.includedAmenities && selected.includedAmenities.map((inc, i) => <li key={i} className="amenity-item">{inc}</li>)}
									</ul>
								</div>
								<div style={{width: '1px', background: '#e5e7eb', alignSelf: 'stretch'}}></div>
								<div className="amenities-section">
									<div className="amenities-title">Excluded Amenities</div>
									<ul className="amenities-list">
										{selected.excludedAmenities && selected.excludedAmenities.map((exc, i) => <li key={i} className="amenity-item">{exc}</li>)}
									</ul>
								</div>
							</div>
							{/* Add landlord info if available */}
							{selected.landlord && (
								<div className="modal-landlord-info">
									<div className="modal-label">Landlord Info</div>
									<div>Name: {selected.landlord.name}</div>
									<div>Address: {selected.landlord.address}</div>
									<div>Contact: {selected.landlord.contact}</div>
								</div>
							)}
							<div className="modal-actions">
								<button className="modal-btn reject">Reject</button>
								<button className="modal-btn approve" onClick={handleApprove}>Approve</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PendingApproval;
