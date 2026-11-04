// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// แทนที่ด้วยค่า firebaseConfig ที่ได้จาก Project Settings ใน Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBIWCDYYlnw8MZEM29TWI2TYuhQNpYW86w",
  authDomain: "react-nextjs-app-10071.firebaseapp.com",
  projectId: "react-nextjs-app-10071",
  storageBucket: "react-nextjs-app-10071.firebasestorage.app",
  messagingSenderId: "267118724554",
  appId: "1:267118724554:web:42c1a9c75bbe8c33357b33",
  measurementId: "G-RN5X0RNBPL",
};

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// ส่งออก db (Firestore) เพื่อนำไปใช้งานในคอมโพเนนต์อื่น
export const db = getFirestore(app);
