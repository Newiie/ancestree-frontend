// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFHDRlE19Q5D7mULYqxnBvzSXiG1JUCT8",
  authDomain: "ancestree-se.firebaseapp.com",
  projectId: "ancestree-se",
  storageBucket: "ancestree-se.appspot.com",
  messagingSenderId: "1024952238384",
  appId: "1:1024952238384:web:938d6b046e6b7608d7c8f5",
  measurementId: "G-TBC6KVN1D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const db=getFirestore(app);

export default app;
