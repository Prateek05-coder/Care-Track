import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKYT_vbQHErN73jz9Tu65ibClcJQlm2lo",
  authDomain: "care-track-956d5.firebaseapp.com",
  projectId: "care-track-956d5",
  storageBucket: "care-track-956d5.appspot.com", // <-- FIXED HERE
  messagingSenderId: "91452741087",
  appId: "1:91452741087:web:665f572c60097ce244206a",
  measurementId: "G-NRX7GJ1W3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();