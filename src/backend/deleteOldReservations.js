// Script to delete all reservations with an empty landlordId from Firestore
// Run with Node.js after configuring your Firebase Admin SDK credentials

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function deleteOldReservations() {
  const snapshot = await db.collection('reservations').get();
  let deleted = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.landlordId || data.landlordId === '') {
      await db.collection('reservations').doc(doc.id).delete();
      console.log(`Deleted reservation with ID: ${doc.id}`);
      deleted++;
    }
  }
  if (deleted === 0) {
    console.log('No old reservations found to delete.');
  } else {
    console.log(`Deleted ${deleted} old reservations.`);
  }
}

deleteOldReservations().catch(console.error);
