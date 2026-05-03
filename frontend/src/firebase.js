// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBUQtGuE7Kq0N1TKDI_e32GjhPMSqog6Q",
  authDomain: "sdpproject1-c0360.firebaseapp.com",
  projectId: "sdpproject1-c0360",
  storageBucket: "sdpproject1-c0360.firebasestorage.app",
  messagingSenderId: "931006212300",
  appId: "1:931006212300:web:6b9677404a469f32447a69",
  measurementId: "G-42G4P9QPSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
