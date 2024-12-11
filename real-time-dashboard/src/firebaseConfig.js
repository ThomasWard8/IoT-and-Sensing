import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCqGt6zlmEONt6TOdITUoQ2w40blgRN8NE",
    authDomain: "rise-4543c.firebaseapp.com",
    projectId: "rise-4543c",
    storageBucket: "rise-4543c.firebasestorage.app",
    messagingSenderId: "489956766330",
    appId: "1:489956766330:web:2c51d1da4724d2410881c3",
    measurementId: "G-1VPYZL1TPY"
  };

  const firebaseApp = initializeApp(firebaseConfig); // Initialize Firebase app
  const db = getFirestore(firebaseApp); // Get Firestore database
  
  // Export everything you need
  export { firebaseApp, db, collection, query, onSnapshot };
