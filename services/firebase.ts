// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6aGidHQEMrLrVCbWagEZorSbrLN3AWUI",
  authDomain: "campus-app-9a1bf.firebaseapp.com",
  projectId: "campus-app-9a1bf",
  storageBucket: "campus-app-9a1bf.firebasestorage.app",
  messagingSenderId: "163964736987",
  appId: "1:163964736987:web:c5d48afeb2066a77f743fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
