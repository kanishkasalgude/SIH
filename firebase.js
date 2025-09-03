// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYco-JE7ovtv4PQfdVgX0HGr1VWarxAfQ",
  authDomain: "agrochain-8d695.firebaseapp.com",
  projectId: "agrochain-8d695",
  storageBucket: "agrochain-8d695.firebasestorage.app",
  messagingSenderId: "593206012942",
  appId: "1:593206012942:web:a2d19f85029748162ae05f",
  measurementId: "G-66XFDC2TSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;