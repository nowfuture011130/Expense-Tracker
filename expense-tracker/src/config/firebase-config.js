// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATzJNurAREYb1lGRvU0jGd8rjcnnMhszY",
  authDomain: "expense-tracker-a6f87.firebaseapp.com",
  projectId: "expense-tracker-a6f87",
  storageBucket: "expense-tracker-a6f87.appspot.com",
  messagingSenderId: "262969371513",
  appId: "1:262969371513:web:633d15f22cb815abc5dda8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
