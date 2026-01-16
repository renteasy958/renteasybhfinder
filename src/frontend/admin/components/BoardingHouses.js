import React, { useState, useEffect } from 'react';
import '../styles/boardinghouses.css';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

const tabs = [
	{ key: 'available', label: 'Available' },
	{ key: 'occupied', label: 'Occupied' },
];


const BoardingHouses = () => {
	const [activeTab, setActiveTab] = useState('available');
	const [boardingHouses, setBoardingHouses] = useState([]);
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		const fetchApproved = async () => {
			const q = query(collection(db, 'boardingHouses'));
			const querySnapshot = await getDocs(q);
			const allHouses = [];
			for (const bhDoc of querySnapshot.docs) {
				const data = bhDoc.data();
				let landlord = null;
				if (data.userId) {
					let landlordDoc = await getDoc(doc(db, 'users', data.userId));
					if (!landlordDoc.exists()) {
						landlordDoc = await getDoc(doc(db, 'landlords', data.userId));
					}
					if (landlordDoc.exists()) {
						landlord = { id: landlordDoc.id, ...landlordDoc.data() };
					}
				}
				let tenant = null;
				if (data.tenantId) {
					const tenantDoc = await getDoc(doc(db, 'tenants', data.tenantId));
					if (tenantDoc.exists()) {
						tenant = { id: tenantDoc.id, ...tenantDoc.data() };
					}
				}
				allHouses.push({ id: bhDoc.id, ...data, landlord, tenant });
			}
			// Filter based on tab
			let houses = [];
			if (activeTab === 'available') {
				houses = allHouses.filter(h => h.status === 'approved' && (!h.tenantId || !h.tenant));
			} else if (activeTab === 'occupied') {
				houses = allHouses.filter(h => h.tenantId && h.tenant);
			}
			setBoardingHouses(houses);
		};
		fetchApproved();
	}, [activeTab]);

	const handleCardClick = (bh) => {
		setSelected(bh);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelected(null);
		setCurrentImageIndex(0);
	};

	const nextImage = () => {
		if (selected && selected.images) {
			setCurrentImageIndex((prev) => (prev + 1) % selected.images.length);
		}
	};

	const prevImage = () => {
		if (selected && selected.images) {
			setCurrentImageIndex((prev) => (prev - 1 + selected.images.length) % selected.images.length);
		}
	};

	return (
		<div className="admin-page">
			<div className="bh-tabs">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`bh-tab${activeTab === tab.key ? ' active' : ''}`}
						onClick={() => setActiveTab(tab.key)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="bh-cards-list">
				<div className="card-row">
					{boardingHouses.length === 0 ? (
						<p style={{textAlign: 'center', width: '100%'}}>No boarding houses found</p>
					) : (
						boardingHouses.map((bh) => (
							<div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)} style={{cursor: 'pointer'}}>
								<div className="card-image-container" style={bh.images && bh.images[0] ? {backgroundImage: `url(${bh.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}></div>
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
								<div className="carousel-container">
									{selected.images && selected.images.length > 0 ? (
										<>
											<button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<polyline points="15 18 9 12 15 6"></polyline>
												</svg>
											</button>
											<div className="carousel-image">
												<img src={selected.images[currentImageIndex]} alt="Boarding House" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
											</div>
											<button className="carousel-btn carousel-btn-next" onClick={nextImage}>
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
													<polyline points="9 18 15 12 9 6"></polyline>
												</svg>
											</button>
											<div className="carousel-indicators">
												{selected.images.map((_, index) => (
													<button
														key={index}
														className={`carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
														onClick={() => setCurrentImageIndex(index)}
													/>
												))}
											</div>
										</>
									) : (
										<div className="carousel-image">
											<span className="carousel-placeholder">No images</span>
										</div>
									)}
								</div>
								<div className="modal-details">
									<div className="modal-bh-name">{selected.name}</div>
									<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.address || 'N/A'}</div>
									<div className="modal-info-row"><span className="modal-label">Type:</span> {selected.type || 'N/A'}</div>
									<div className="modal-info-row"><span className="modal-label">Price:</span> <span className="modal-price">{selected.price || 'N/A'}</span></div>
									{selected.status.toLowerCase() === 'available' && (
										<div className="modal-info-row"><span className="modal-label">Quantity Available:</span> {selected.quantity}</div>
									)}
									{selected.status.toLowerCase() === 'available' && (
										<div className="modal-info-row"><span className="modal-label">Available Rooms:</span> {selected.availableRooms || 0}</div>
									)}
									<div className="modal-amenities">
										<div className="amenities-section">
											<div className="amenities-title">Inclusions</div>
											<ul className="amenities-list">
												{selected.inclusions && selected.inclusions.map((inc, i) => <li key={i} className="amenity-item included">{inc}</li>)}
											</ul>
										</div>
										<div className="amenities-section">
											<div className="amenities-title">Exclusions</div>
											<ul className="amenities-list">
												{selected.exclusions && selected.exclusions.map((exc, i) => <li key={i} className="amenity-item excluded">{exc}</li>)}
											</ul>
										</div>
									</div>
									<div className="modal-landlord-info">
										<div className="modal-label">Landlord Info</div>
										{selected.landlord ? (
											<>
												<div>Name: {selected.landlord.name}</div>
												<div>Address: {selected.landlord.address}</div>
												<div>Contact: {selected.landlord.contact}</div>
											</>
										) : (
											<div>No landlord information available</div>
										)}
									</div>
									{(selected.tenantId || selected.tenant) && (
										<div className="modal-tenant-info">
											<div className="modal-label">Tenant Info</div>
											<div>Name: {selected.tenant ? selected.tenant.name : 'N/A'}</div>
											<div>Address: {selected.tenant ? selected.tenant.address : 'N/A'}</div>
											<div>Age: {selected.tenant ? selected.tenant.age : 'N/A'}</div>
											<div>Birthdate: {selected.tenant ? selected.tenant.birthdate : 'N/A'}</div>
											<div>Civil Status: {selected.tenant ? selected.tenant.civilStatus : 'N/A'}</div>
											<div>Gender: {selected.tenant ? selected.tenant.gender : 'N/A'}</div>
											<div>Mobile: {selected.tenant ? selected.tenant.mobile : 'N/A'}</div>
											<div>Email: {selected.tenant ? selected.tenant.email : 'N/A'}</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
		</div>
	);
};

export default BoardingHouses;
