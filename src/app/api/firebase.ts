// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYkR4ip5e2CWu4ao5CRtCq1hOAW90nBFU",
  authDomain: "excel-logo-puzzle.firebaseapp.com",
  databaseURL: "https://excel-logo-puzzle-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "excel-logo-puzzle",
  storageBucket: "excel-logo-puzzle.appspot.com",
  messagingSenderId: "122009972834",
  appId: "1:122009972834:web:6df10bc18c066fcceb213b",
  measurementId: "G-Z4KBZJP2NQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);