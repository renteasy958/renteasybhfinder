const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

admin.initializeApp();
const db = admin.firestore();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    cloudinary.uploader.upload_stream({
      folder: 'renteasy',
      public_id: uuidv4(),
    }, async (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      const docRef = await db.collection('images').add({
        url: result.secure_url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ url: result.secure_url, id: docRef.id });
    }).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.api = functions.https.onRequest(app);
