import React, { useState, useEffect } from 'react';
import '../styles/boardinghouses.css';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const tabs = [
	{ key: 'available', label: 'Available' },
	{ key: 'occupied', label: 'Occupied' },
];


const BoardingHouses = () => {
	const [activeTab, setActiveTab] = useState('available');
	const [boardingHouses, setBoardingHouses] = useState([]);
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchApproved = async () => {
			const q = query(collection(db, 'boardingHouses'), where('status', '==', activeTab === 'available' ? 'approved' : 'occupied'));
			const querySnapshot = await getDocs(q);
			const houses = [];
			querySnapshot.forEach((doc) => {
				houses.push({ id: doc.id, ...doc.data() });
			});
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
								{boardingHouses.map((bh) => (
									<div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)} style={{cursor: 'pointer'}}>
										<div className="card-image-container" style={bh.images && bh.images[0] ? {backgroundImage: `url(${bh.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}></div>
										<div className="card-content">
											<div className="card-name">{bh.name}</div>
											<div className="card-type">{bh.type}</div>
											<div className="card-price">{bh.price}</div>
										</div>
									</div>
								))}
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
									<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.address}</div>
									<div className="modal-info-row"><span className="modal-label">Type:</span> {selected.type}</div>
									<div className="modal-info-row"><span className="modal-label">Price:</span> <span className="modal-price">{selected.price}</span></div>
									{selected.status.toLowerCase() === 'available' && (
										<div className="modal-info-row"><span className="modal-label">Quantity Available:</span> {selected.quantity}</div>
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
										<div>Name: {selected.landlord.name}</div>
										<div>Address: {selected.landlord.address}</div>
										<div>Contact: {selected.landlord.contact}</div>
									</div>
									{selected.status.toLowerCase() === 'occupied' && selected.tenant && (
										<div className="modal-tenant-info">
											<div className="modal-label">Tenant Info</div>
											<div>Name: {selected.tenant.name}</div>
											<div>Address: {selected.tenant.address}</div>
											<div>Age: {selected.tenant.age}</div>
											<div>Birthdate: {selected.tenant.birthdate}</div>
											<div>Civil Status: {selected.tenant.civilStatus}</div>
											<div>Gender: {selected.tenant.gender}</div>
											<div>Mobile: {selected.tenant.mobile}</div>
											<div>Email: {selected.tenant.email}</div>
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
