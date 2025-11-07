// js/firebase-config.js

// Import HANYA yang diperlukan untuk inisialisasi
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase Anda
// (Pastikan Anda mengisi ini dengan kredensial Anda yang sebenarnya)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm6tPXWUZIQZTKk-wbZKQ7Wh1o0YyPEwA",
  authDomain: "inputnilaimahasiswa-dfbf9.firebaseapp.com",
  projectId: "inputnilaimahasiswa-dfbf9",
  storageBucket: "inputnilaimahasiswa-dfbf9.firebasestorage.app",
  messagingSenderId: "737243840791",
  appId: "1:737243840791:web:63206f6389d65f009c3752",
  measurementId: "G-FHSB165NRP",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export 'db' agar bisa di-import dan digunakan oleh file lain (seperti logic.js)
export { db };
