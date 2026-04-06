import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Your config (keep as is)
const firebaseConfig = {
  apiKey: "AIzaSyDXNzCsqGldCLaIvP5KywSkdTMwRiwVDI0",
  authDomain: "xp-plus-ee521.firebaseapp.com",
  projectId: "xp-plus-ee521",
  storageBucket: "xp-plus-ee521.firebasestorage.app",
  messagingSenderId: "1077779938362",
  appId: "1:1077779938362:web:533fcfee797dacab690903",
  measurementId: "G-ZHFFPV5EPR"
};

const app = initializeApp(firebaseConfig);

// ✅ ADD THESE
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();