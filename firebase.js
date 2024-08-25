// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAno4M7sHlN_mNDF0EozGSKMtbvT_3Q3So",
  authDomain: "task-manager-mern-b6436.firebaseapp.com",
  projectId: "task-manager-mern-b6436",
  storageBucket: "task-manager-mern-b6436.appspot.com",
  messagingSenderId: "32065689242",
  appId: "1:32065689242:web:a5432648f90117b75ab123",
  measurementId: "G-C88CDFB5JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);    