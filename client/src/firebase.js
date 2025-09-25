// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Make sure getAuth is imported

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUzIDT-OiQqGWufFTEyBE7h9sjNXwt0_A",
  authDomain: "fakenews-88a5b.firebaseapp.com",
  projectId: "fakenews-88a5b",
  storageBucket: "fakenews-88a5b.appspot.com",
  messagingSenderId: "23319593444",
  appId: "1:23319593444:web:30366c2e9c4c6c9c5f87f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT Firebase Authentication
export const auth = getAuth(app);
