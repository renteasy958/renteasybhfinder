import React, { useState } from 'react';
import '../styles/pendingapproval.css';

const sampleBH = [
	{
		id: 1,
		name: 'Sunrise Dormitory',
		type: 'Dorm',
		price: '₱3,500/mo',
		images: [
			'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
			'https://images.unsplash.com/photo-1464983953574-0892a716854b',
		],
		address: '123 Main St, City, Province',
		inclusions: ['WiFi', 'Water', 'Electricity'],
		exclusions: ['Meals', 'Laundry'],
		landlord: {
			name: 'Juan Dela Cruz',
			address: '456 Landlord St, City, Province',
			contact: '09171234567',
		},
		mapsUrl: 'https://maps.google.com/?q=123+Main+St',
	},
	{
		id: 2,
		name: 'Blue House',
		type: 'Apartment',
		price: '₱5,000/mo',
		images: [
			'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
		],
		address: '456 Blue St, City, Province',
		inclusions: ['WiFi'],
		exclusions: ['Water', 'Electricity', 'Meals'],
		landlord: {
			name: 'Maria Santos',
			address: '789 Landlord Ave, City, Province',
			contact: '09179876543',
		},
		mapsUrl: 'https://maps.google.com/?q=456+Blue+St',
	},
];

const PendingApproval = () => {
	const [selected, setSelected] = useState(null);
	const [showModal, setShowModal] = useState(false);

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
			<div className="bh-cards-list">
				<div className="card-row">
					{sampleBH.map((bh) => (
						<div key={bh.id} className="rectangle-card" onClick={() => handleCardClick(bh)}>
							<div className="card-image-container" style={{backgroundImage: bh.images[0] ? `url(${bh.images[0]})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
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
							{selected.images.map((img, idx) => (
								<img key={idx} src={img} alt="BH" className="modal-img" />
							))}
						</div>
						<div className="modal-details">
							<div className="modal-bh-name">{selected.name}</div>
							<div className="modal-info-row"><span className="modal-label">Address:</span> {selected.address}</div>
							<div className="modal-info-row"><span className="modal-label">Type:</span> {selected.type}</div>
							  <div className="modal-info-row"><span className="modal-label">Price:</span> <span className="modal-price">{selected.price}</span></div>
							<div className="modal-amenities">
								<div className="amenities-section">
									<div className="amenities-title">Inclusions</div>
									<ul className="amenities-list">
										{selected.inclusions.map((inc, i) => <li key={i} className="amenity-item included">{inc}</li>)}
									</ul>
								</div>
								<div className="amenities-section">
									<div className="amenities-title">Exclusions</div>
									<ul className="amenities-list">
										{selected.exclusions.map((exc, i) => <li key={i} className="amenity-item excluded">{exc}</li>)}
									</ul>
								</div>
							</div>
							<div className="modal-landlord-info">
								<div className="modal-label">Landlord Info</div>
								<div>Name: {selected.landlord.name}</div>
								<div>Address: {selected.landlord.address}</div>
								<div>Contact: {selected.landlord.contact}</div>
							</div>
							<div className="modal-actions">
								<button className="modal-btn reject">Reject</button>
								<button className="modal-btn approve">Approve</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PendingApproval;
