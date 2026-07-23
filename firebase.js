// ===============================
// CNG CAFE - Firebase Configuration
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ===============================
// YOUR FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyDbnNaoVc8Z6Q8DHaag31Ky9p_2nYa_oDI",
  authDomain: "cng-cafe.firebaseapp.com",
  projectId: "cng-cafe",
  storageBucket: "cng-cafe.firebasestorage.app",
  messagingSenderId: "463508153952",
  appId: "1:463508153952:web:44fa275a907f36d59f0505",
  measurementId: "G-LQP1LM3RSR"
};
// ===============================
// Initialize Firebase
// ===============================

const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Authentication
const auth = getAuth(app);

// Storage
const storage = getStorage(app);

// ===============================
// Export Everything
// ===============================

export {

    db,
    auth,
    storage,

    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,

    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

};