import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6aGidHQEMrLrVCbWagEZorSbrLN3AWUI",
  authDomain: "campus-app-9a1bf.firebaseapp.com",
  projectId: "campus-app-9a1bf",
  storageBucket: "campus-app-9a1bf.firebasestorage.app",
  messagingSenderId: "163964736987",
  appId: "1:163964736987:web:c5d48afeb2066a77f743fe"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
