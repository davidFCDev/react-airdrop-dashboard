// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKgzvz0yVwHW4felX-MJU2XHzr71DkzdE",
  authDomain: "react-airdrop-dashboard.firebaseapp.com",
  projectId: "react-airdrop-dashboard",
  storageBucket: "react-airdrop-dashboard.firebasestorage.app",
  messagingSenderId: "747806751977",
  appId: "1:747806751977:web:0e6ef6e511b735e3c38478",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
