// firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration

  const firebaseConfig = {
  apiKey: "AIzaSyAFH280ldMUw51jSwiA2vf6sG80cDZJ1sU",
  authDomain: "vconnect-1d8a7.firebaseapp.com",
  projectId: "vconnect-1d8a7",
  storageBucket: "vconnect-1d8a7.firebasestorage.app",
  messagingSenderId: "33684021461",
  appId: "1:33684021461:web:fa46c5288580e07667825c",
  measurementId: "G-XELZM6CZRC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
