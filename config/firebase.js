import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA77krnBdyqoWT4OF0tTAOkSa_9auj_Nn4",
  authDomain: "pin-pro-shop.firebaseapp.com",
  projectId: "pin-pro-shop",
  storageBucket: "pin-pro-shop.firebasestorage.app",
  messagingSenderId: "874136609692",
  appId: "1:874136609692:web:d2bbb6dd705eef2eafde59"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);