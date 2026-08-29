import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMte3FsLZB0a-XU6bVFnqJ0EeUA7pKZ1A",
  authDomain: "csjr1743.firebaseapp.com",
  projectId: "csjr1743",
  storageBucket: "csjr1743.firebasestorage.app",
  messagingSenderId: "868123575329",
  appId: "1:868123575329:web:245af791a3c642b804cf60",
  measurementId: "G-M4YJ2KXCJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, deleteDoc, doc, ref, uploadBytes, getDownloadURL };
