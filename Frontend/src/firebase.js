// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "marshal-blog.firebaseapp.com",
  projectId: "marshal-blog",
  storageBucket: "marshal-blog.appspot.com",
  messagingSenderId: "959837442535",
  appId: "1:959837442535:web:775798ee862894319ded42"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);