import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBnqOaWSAg58FDuB2fP8Cb5zgBI00nHVQI",
  authDomain: "wr-web-fec66.firebaseapp.com",
  projectId: "wr-web-fec66",
  storageBucket: "wr-web-fec66.firebasestorage.app",
  messagingSenderId: "386363692786",
  appId: "1:386363692786:web:ac7e92c6cbd8d80f7ba26b",
  measurementId: "G-H8KJ9Z3VRX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);