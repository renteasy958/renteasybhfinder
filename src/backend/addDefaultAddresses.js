// This script updates all user and landlord documents in Firestore to include address fields if missing.
// Run this with Node.js after configuring your Firebase Admin SDK credentials.

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const defaultAddress = {
  street: '123 Main St',
  barangay: 'Barangay 1',
  city: 'Isabela',
  province: 'Negros Occidental'
};

async function updateCollectionAddresses(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.street || !data.barangay || !data.city || !data.province) {
      await db.collection(collectionName).doc(doc.id).update({
        street: data.street || defaultAddress.street,
        barangay: data.barangay || defaultAddress.barangay,
        city: data.city || defaultAddress.city,
        province: data.province || defaultAddress.province
      });
      console.log(`Updated address for ${collectionName}/${doc.id}`);
    }
  }
}

async function main() {
  await updateCollectionAddresses('users');
  await updateCollectionAddresses('landlords');
  console.log('All user and landlord addresses updated.');
}

main().catch(console.error);
