// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvoaDD9NsENfGpZDkLnU_meZ51W-EeiFg",
  authDomain: "renteasybh.firebaseapp.com",
  projectId: "renteasybh",
  storageBucket: "renteasybh.firebasestorage.app",
  messagingSenderId: "1053824867876",
  appId: "1:1053824867876:web:ef4185e1a3646ab79fc2b1",
  measurementId: "G-KGR50MWKW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
