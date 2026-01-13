// Script to delete the test tenant from Firestore
import { db } from './src/firebase/config.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function deleteTestTenant() {
  try {
    const querySnapshot = await getDocs(collection(db, 'tenants'));
    for (const document of querySnapshot.docs) {
      const data = document.data();
      if (data.name === 'Test Tenant') {
        await deleteDoc(doc(db, 'tenants', document.id));
        console.log('Deleted test tenant with ID:', document.id);
      }
    }
    console.log('Test tenant removal complete.');
  } catch (e) {
    console.error('Error deleting test tenant:', e);
  }
}

deleteTestTenant();
