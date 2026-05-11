import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace this with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBYFu6f_Re-oOXBbb31DRVuNQxWqvXocYw",
  authDomain: "hokage-fabee.firebaseapp.com",
  projectId: "hokage-fabee",
  storageBucket: "hokage-fabee.firebasestorage.app",
  messagingSenderId: "71225557212",
  appId: "1:71225557212:web:d5bf06d527dfc92e9c3419",
  measurementId: "G-ZJ03H935FE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
