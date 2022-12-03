import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVD4A8HxD89zy5BSy8highCALiJVETxVY",
  authDomain: "ticomo01.firebaseapp.com",
  projectId: "ticomo01",
  storageBucket: "ticomo01.appspot.com",
  messagingSenderId: "275031793021",
  appId: "1:275031793021:web:25768c22860f6cf2730014",
  measurementId: "G-KQ7W453NJ0"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);