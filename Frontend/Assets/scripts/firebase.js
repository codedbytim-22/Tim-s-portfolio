// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEB2mBy18KFqpcAKyyGRLsLGnkcJ7yZek",
  authDomain: "tim-s-portfolio.firebaseapp.com",
  projectId: "tim-s-portfolio",
  storageBucket: "tim-s-portfolio.firebasestorage.app",
  messagingSenderId: "594331073944",
  appId: "1:594331073944:web:c9ce8b8e01e0e68ccabfed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.FirebaseDB = {
  db,
  collection,
  addDoc,
  serverTimestamp,
};
console.log("🔥 Firebase initialized successfully");
