// Run this script with Node.js after installing firebase-admin
// npm install firebase-admin

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download this from Firebase Console > Project Settings > Service Accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

const email = 'renteasy@gmail.com';
const password = 'renteasy';

async function createAdminUser() {
  try {
    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password
      });
      console.log('User created:', userRecord.uid);
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        userRecord = await auth.getUserByEmail(email);
        console.log('User already exists:', userRecord.uid);
      } else {
        throw err;
      }
    }

    // Set userType to admin in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      userType: 'admin',
      email,
      firstName: 'Admin',
      surname: 'User',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('Admin user set in Firestore.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
