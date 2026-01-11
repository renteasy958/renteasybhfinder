import React, { useState } from 'react';
import '../styles/addbh.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import LLNavbar from './llnavbar';
import { db, storage } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AddBH = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null); // { lat, lng }
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sitio: '',
    barangay: '',
    municipality: 'Isabela',
    province: 'Neg. Occ.',
    type: '',
    price: ''
  });

  const amenitiesList = [
    'Wifi', 'Comfort room', 'Kitchen', 'Aircon', 'Laundry',
    'Water', 'Electricity', 'Bed', 'Table', 'Chair', 'Security', 'Cabinet'
  ];

  const [includedAmenities, setIncludedAmenities] = useState([]);
  const [excludedAmenities, setExcludedAmenities] = useState([]);

  const toggleIncludedAmenity = (amenity) => {
    if (includedAmenities.includes(amenity)) {
      setIncludedAmenities(includedAmenities.filter(a => a !== amenity));
    } else {
      setIncludedAmenities([...includedAmenities, amenity]);
      setExcludedAmenities(excludedAmenities.filter(a => a !== amenity));
    }
  };

  const toggleExcludedAmenity = (amenity) => {
    if (excludedAmenities.includes(amenity)) {
      setExcludedAmenities(excludedAmenities.filter(a => a !== amenity));
    } else {
      setExcludedAmenities([...excludedAmenities, amenity]);
      setIncludedAmenities(includedAmenities.filter(a => a !== amenity));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Bounds for Isabela, Negros Occidental (covering Barangay 1-9 Poblacion only)
  // Coordinates: 10°12′N 122°59′E (10.2, 122.98)
  const isabelaBounds = {
    north: 10.2125,
    south: 10.1975,
    east: 122.9975,
    west: 122.9825
  };

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Check if click is within Isabela bounds
        if (lat >= isabelaBounds.south && lat <= isabelaBounds.north &&
            lng >= isabelaBounds.west && lng <= isabelaBounds.east) {
          setLocation({ lat, lng });
        } else {
          alert('Please select a location within Isabela, Negros Occidental (Barangay 1-9 area only)');
        }
      },
    });
    return null;
  };

  const handleImageClick = () => {
    if (images.length >= 8) return;
    document.getElementById('image-input').click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.slice(0, 8 - images.length).map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = async () => {
    try {
      // Upload images to Firebase Storage and get download URLs
      const imageUrls = [];
      for (const image of images) {
        const timestamp = Date.now();
        const storageRef = ref(storage, `boardingHouses/${timestamp}_${image.file.name}`);
        await uploadBytes(storageRef, image.file);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      const boardingHouseData = {
        ...formData,
        images: imageUrls,
        includedAmenities,
        excludedAmenities,
        location,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'boardingHouses'), boardingHouseData);
      
      setShowSuccess(true);
      setTimeout(() => {
        onNavigate('llhome');
      }, 3000);
    } catch (error) {
      console.error('Error adding boarding house:', error);
      alert('Error submitting boarding house. Please try again.');
    }
  };

  return (
    <div className="addbh-container">
      <LLNavbar onNavigate={onNavigate} />
      
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-checkmark">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <p className="success-text">Wait for the approval</p>
          </div>
        </div>
      )}

      <div className="addbh-content">
        <div className="step-indicator">
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className="step-label">Amenities</div>
          </div>
          <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className="step-item">
            <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            <div className="step-label">Maps</div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="form-section">
            <div className="form-split">
              <div className="form-left">
                <h3>Upload Images</h3>
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="image-upload-grid">
                  {images.map((image) => (
                    <div key={image.id} className="image-upload-box uploaded">
                      <img src={image.url} alt="Upload" />
                      <button className="remove-image" onClick={() => removeImage(image.id)}>&times;</button>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <div className="image-upload-box" onClick={handleImageClick}>
                      <div className="upload-placeholder">
                        <span>+</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-right">
                <h3>Details</h3>
                <div className="form-fields">
                  <div className="form-group">
                    <label>Name of Boarding House</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter boarding house name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <div className="address-row">
                      <input
                        type="text"
                        name="sitio"
                        value={formData.sitio}
                        onChange={handleInputChange}
                        placeholder="Sitio/Street"
                        className="address-input"
                      />
                      <select name="barangay" value={formData.barangay} onChange={handleInputChange} className="address-input">
                        <option value="">Barangay</option>
                        <option value="Barangay 1">Barangay 1</option>
                        <option value="Barangay 2">Barangay 2</option>
                        <option value="Barangay 3">Barangay 3</option>
                        <option value="Barangay 4">Barangay 4</option>
                        <option value="Barangay 5">Barangay 5</option>
                        <option value="Barangay 6">Barangay 6</option>
                        <option value="Barangay 7">Barangay 7</option>
                        <option value="Barangay 8">Barangay 8</option>
                        <option value="Barangay 9">Barangay 9</option>
                      </select>
                      <input
                        type="text"
                        name="municipality"
                        value={formData.municipality}
                        readOnly
                        className="address-input readonly-input"
                      />
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        readOnly
                        className="address-input readonly-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Type of Boarding House</label>
                        <select name="type" value={formData.type} onChange={handleInputChange}>
                          <option value="">Select Type</option>
                          <option value="Bed Spacer">Bed Spacer</option>
                          <option value="Single Room">Single Room</option>
                          <option value="Shared Room (2-4 pax)">Shared Room (2-4 pax)</option>
                          <option value="Shared Room (5-8 pax)">Shared Room (5-8 pax)</option>
                          <option value="Apartment Type">Apartment Type</option>
                          <option value="Family">Family</option>
                        </select>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity || ''}
                          onChange={handleInputChange}
                          placeholder="Quantity"
                          min="1"
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Price</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Enter price"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Enter a short description of the boarding house"
                      rows={3}
                      className="input description-input"
                      style={{ resize: 'none', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', fontSize: '15px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-navigation">
              <button className="back-button" onClick={() => onNavigate('llhome')}>Back</button>
              <button className="next-button" onClick={() => setCurrentStep(2)}>Next</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-section">
            <div className="amenities-container" style={{ display: 'flex', gap: '0', alignItems: 'stretch', position: 'relative' }}>
              <div className="amenities-section" style={{ flex: 1, paddingRight: '24px' }}>
                <h3>Included in Monthly Payment</h3>
                <div className="amenities-grid">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity}
                      className={`amenity-item ${
                        includedAmenities.includes(amenity) ? 'selected' : ''
                      } ${
                        excludedAmenities.includes(amenity) ? 'disabled' : ''
                      }`}
                      onClick={() => !excludedAmenities.includes(amenity) && toggleIncludedAmenity(amenity)}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '2px', background: '#e5e7eb', height: 'auto', margin: '0 0', alignSelf: 'stretch' }}></div>
              <div className="amenities-section" style={{ flex: 1, paddingLeft: '24px' }}>
                <h3>Excluded in Monthly Payment</h3>
                <div className="amenities-grid">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity}
                      className={`amenity-item ${
                        excludedAmenities.includes(amenity) ? 'selected-excluded' : ''
                      } ${
                        includedAmenities.includes(amenity) ? 'disabled' : ''
                      }`}
                      onClick={() => !includedAmenities.includes(amenity) && toggleExcludedAmenity(amenity)}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-navigation">
              <button className="back-button" onClick={() => setCurrentStep(1)}>Back</button>
              <button className="next-button" onClick={() => setCurrentStep(3)}>Next</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-section">
            <div className="map-container">
              <div className="map-wrapper">
                <MapContainer
                  center={[10.2, 122.98]} // Isabela, Negros Occidental coordinates (10°12′N 122°59′E)
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Rectangle
                    bounds={[
                      [isabelaBounds.south, isabelaBounds.west],
                      [isabelaBounds.north, isabelaBounds.east]
                    ]}
                    pathOptions={{ color: '#012e6a', weight: 2, fillOpacity: 0.1 }}
                  />
                  <MapClickHandler />
                  {location && <Marker position={[location.lat, location.lng]} />}
                </MapContainer>
              </div>
              {/* Removed Selected Location display as requested */}
            </div>

            <div className="form-navigation">
              <button className="back-button" onClick={() => setCurrentStep(2)}>Back</button>
              <button className="next-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBH;
