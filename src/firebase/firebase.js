// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase , ref ,child , push} from  "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getDatabase(app);

export let dbRef = ref(db);

// console.log(dbRef , "dbRef");

export let connectedRef =  ref(db , ".info/connected");

export const userName = prompt("What's Your Name?");

const roomId =  (new URLSearchParams(window.location.search)).get("roomId");

if(roomId){
  console.log(roomId);
    dbRef = child(dbRef,roomId);
    // console.log(dbRef, "child dbRef")
}else{
    dbRef = push(dbRef); 
    const key = dbRef.key;
    window.history.replaceState( null ,"",`?roomId=${key}`);
}