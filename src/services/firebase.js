// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: DÁN CONFIG FIREBASE CỦA M Ở ĐÂY
const firebaseConfig = {
  apiKey: "AIzaSyB3tCioB4Cbvlss-y5CqRVFpDf67GB6UJc",
  authDomain: "soc-trang-tour.firebaseapp.com",
  projectId: "soc-trang-tour",
  storageBucket: "soc-trang-tour.firebasestorage.app",
  messagingSenderId: "54714574287",
  appId: "1:54714574287:web:e436ec70a1970ec93f5eba",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { serverTimestamp };
