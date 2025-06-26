import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuor4mXwVjs01GYnv7VIpDmiS4sI4Tubg",
  authDomain: "trial-95887.firebaseapp.com",
  projectId: "trial-95887",
  storageBucket: "trial-95887.firebasestorage.app",
  messagingSenderId: "809983834418",
  appId: "1:809983834418:web:366ba6ba18a73cdebbbf2b",
  databaseUrl : "https://trial-95887-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);

export {auth,app, db};