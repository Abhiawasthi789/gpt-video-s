// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn4oYyrVb58TMffN5dM-lIaYuxvOr-l5g",
  authDomain: "gpt-vid.firebaseapp.com",
  projectId: "gpt-vid",
  storageBucket: "gpt-vid.firebasestorage.app",
  messagingSenderId: "677980530866",
  appId: "1:677980530866:web:0890c5c530b89f583301ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
