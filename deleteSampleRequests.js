// Script to delete sample landlord withdrawal requests from Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import firebaseConfig from './src/firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteSampleRequests() {
  const requestsRef = collection(db, 'requests');
  const snapshot = await getDocs(requestsRef);
  let deleted = 0;
  for (const d of snapshot.docs) {
    const data = d.data();
    if (
      data.userId === 'sample-ll-001' ||
      data.user === 'Sample Landlord'
    ) {
      await deleteDoc(doc(db, 'requests', d.id));
      deleted++;
      console.log(`Deleted sample request with id: ${d.id}`);
    }
  }
  if (deleted === 0) {
    console.log('No sample requests found.');
  } else {
    console.log(`Deleted ${deleted} sample request(s).`);
  }
}

deleteSampleRequests();