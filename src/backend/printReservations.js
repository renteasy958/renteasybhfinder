// Script to print all reservations and their landlordId fields from Firestore
// Run with Node.js after configuring your Firebase Admin SDK credentials

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function printReservations() {
  const snapshot = await db.collection('reservations').get();
  if (snapshot.empty) {
    console.log('No reservations found.');
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Reservation ID: ${doc.id}`);
    console.log(`  landlordId: ${data.landlordId}`);
    console.log(`  tenantName: ${data.tenantName}`);
    console.log(`  date: ${data.date}`);
    console.log(`  boardingHouseId: ${data.boardingHouseId}`);
    console.log('---');
  });
}

printReservations().catch(console.error);
