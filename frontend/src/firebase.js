// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// 👇 PASTE YOUR REAL CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyBuA-OddDI-FCwENtdzXE6zyCs1CKQMam4",
  authDomain: "desi-making-videsi.firebaseapp.com",
  projectId: "desi-making-videsi",
  storageBucket: "desi-making-videsi.firebasestorage.app",
  messagingSenderId: "928176815882",
  appId: "1:928176815882:web:92a1a4ac596148276384f3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const logout = () => {
  return signOut(auth);
};