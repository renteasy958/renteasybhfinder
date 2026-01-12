// Basic Express server with Cloudinary and Firestore integration
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = require('./firebaseServiceAccountKey.json');
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

const app = express();
app.use(cors());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream({
      folder: 'renteasy',
      public_id: uuidv4(),
    }, async (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      // Save URL to Firestore (example: images collection)
      const docRef = await db.collection('images').add({
        url: result.secure_url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ url: result.secure_url, id: docRef.id });
    });
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
