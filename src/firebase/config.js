// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPQI9KIY1-mEwLzDQfuZrlltAP_2FEQmA",
  authDomain: "cascadevillas.firebaseapp.com",
  projectId: "cascadevillas",
  storageBucket: "cascadevillas.firebasestorage.app",
  messagingSenderId: "181035949779",
  appId: "1:181035949779:web:ba359b200d0dcb2493fe26",
  measurementId: "G-1B4D29K76Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;