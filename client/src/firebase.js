//This code basically inistialized the firebase app

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration. This includes the information about our application.
const firebaseConfig = {
  //the api key is saved inside .env within the client folder
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,    //import.meta is used instead of process cuz we're using vite
  authDomain: "mern-blog-93421.firebaseapp.com",
  projectId: "mern-blog-93421",
  storageBucket: "mern-blog-93421.appspot.com",
  messagingSenderId: "935066254279",
  appId: "1:935066254279:web:30cdd6b9b24ad2eb87f7e2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
