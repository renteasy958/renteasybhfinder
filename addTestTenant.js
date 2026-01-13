// Script to add a test tenant to Firestore
import { db } from './src/firebase/config.js';
import { collection, addDoc } from 'firebase/firestore';

async function addTestTenant() {
  try {
    const docRef = await addDoc(collection(db, 'tenants'), {
      name: 'Test Tenant',
      email: 'testtenant@example.com',
      phone: '1234567890',
      address: '123 Test St',
      gender: 'Other',
      birthday: '2000-01-01',
      civilStatus: 'Single',
      type: 'Regular'
    });
    console.log('Test tenant added with ID:', docRef.id);
  } catch (e) {
    console.error('Error adding test tenant:', e);
  }
}

addTestTenant();
