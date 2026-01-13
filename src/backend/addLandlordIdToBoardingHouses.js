// This script updates all boarding house documents in Firestore to include a landlordId field.
// Run this with Node.js after configuring your Firebase Admin SDK credentials.

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateBoardingHouses() {
  const landlordsSnapshot = await db.collection('landlords').get();
  if (landlordsSnapshot.empty) {
    console.log('No landlords found.');
    return;
  }
  // For demo: use the first landlord for all boarding houses
  const landlord = landlordsSnapshot.docs[0];
  if (!landlord) {
    console.log('No landlord document found.');
    return;
  }
  const landlordId = landlord.id;

  const bhSnapshot = await db.collection('boardingHouses').get();
  for (const doc of bhSnapshot.docs) {
    await db.collection('boardingHouses').doc(doc.id).update({ landlordId });
    console.log(`Updated boarding house ${doc.id} with landlordId ${landlordId}`);
  }
  console.log('All boarding houses updated.');
}

updateBoardingHouses().catch(console.error);
