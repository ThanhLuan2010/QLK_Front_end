// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhVRcvkupDaihzbYM-dyIlQTKQILirmgo",
  authDomain: "qtht-d98b1.firebaseapp.com",
  projectId: "qtht-d98b1",
  storageBucket: "qtht-d98b1.appspot.com",
  messagingSenderId: "822965585837",
  appId: "1:822965585837:web:7355899afa4ab9ed7ec324",
  measurementId: "G-MQ04T54QNW",
  databaseURL: "https://qtht-d98b1-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
