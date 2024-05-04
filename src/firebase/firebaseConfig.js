import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqRJ4LuzqYoz15Hu0_piiwNsFpkCuXpHk",
  authDomain: "assignment-8a023.firebaseapp.com",
  projectId: "assignment-8a023",
  storageBucket: "assignment-8a023.appspot.com",
  messagingSenderId: "121347134814",
  appId: "1:121347134814:web:9ec8c7206c727141a2abcf",
};

//Add your api keys and storage by following instructions from Readme.md


const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
