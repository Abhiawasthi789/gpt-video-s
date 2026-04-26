import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAn4oYyrVb58TMffN5dM-lIaYuxvOr-l5g",
  authDomain: "gpt-vid.firebaseapp.com",
  projectId: "gpt-vid",
  storageBucket: "gpt-vid.firebasestorage.app",
  messagingSenderId: "677980530866",
  appId: "1:677980530866:web:0890c5c530b89f583301ab",
};

initializeApp(firebaseConfig);

export const auth = getAuth();
