// Basic Express server with Cloudinary and Firestore integration
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
require('dotenv').config();

// Initialize Firebase Admin
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
    process.exit(1);
  }
} else {
  try {
    serviceAccount = require('./firebaseServiceAccountKey.json');
  } catch (err) {
    console.error('Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT env var.');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'renteasy',
        public_id: uuidv4(),
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: error.message });
        }
        
        // Return the Cloudinary URL directly
        // The frontend will handle saving to Firestore
        res.json({ url: result.secure_url });
      }
    );
    
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Email notification endpoint for new reservations
app.post('/send-reservation-email', async (req, res) => {
  try {
    console.log('Received email request:', req.body);
    const { landlordEmail, tenantInfo, boardingHouseInfo } = req.body;

    if (!landlordEmail) {
      console.log('Error: No landlord email provided');
      return res.status(400).json({ error: 'Landlord email is required' });
    }

    console.log('Sending email to:', landlordEmail);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: landlordEmail,
      subject: 'New Boarding House Reservation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Reservation Notification</h2>
          <p>You have received a new reservation for your boarding house.</p>
          
          <h3 style="color: #374151; margin-top: 24px;">Tenant Information:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Full Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Age:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.age}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Birthdate:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.birthdate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Gender:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.gender}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Civil Status:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.civilStatus}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Contact Number:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${tenantInfo.contactNumber}</td>
            </tr>
          </table>

          <h3 style="color: #374151; margin-top: 24px;">Boarding House Information:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${boardingHouseInfo.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${boardingHouseInfo.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Type:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${boardingHouseInfo.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Price:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${boardingHouseInfo.price}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Reservation Date:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${boardingHouseInfo.reservationDate}</td>
            </tr>
          </table>

          <p style="margin-top: 24px; color: #6b7280;">Please log in to your account to view and manage this reservation.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', landlordEmail);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
