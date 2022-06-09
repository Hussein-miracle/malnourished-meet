// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase , ref ,child , push} from  "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRnEckuYMrfUl15WgKCT28iQsNSGUSv8s",
  authDomain: "video-chat-app-be44e.firebaseapp.com",
  databaseURL: "https://video-chat-app-be44e-default-rtdb.firebaseio.com",
  projectId: "video-chat-app-be44e",
  storageBucket: "video-chat-app-be44e.appspot.com",
  messagingSenderId: "361861572856",
  appId: "1:361861572856:web:71a5133bb43ea838c3330d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getDatabase(app);

export let dbRef = ref(db);

console.log(dbRef , "dbRef firebase.js" );

export let connectedRef =  ref(db , ".info/connected");

export const userName = prompt("What's Your Name?");

const roomId =  new URLSearchParams(window.location.search).get("roomId");

if(roomId){
  console.log(roomId);
    dbRef = child(dbRef,roomId);
    console.log(dbRef, "child dbRef")
}else{
    dbRef = push(dbRef);
    console.log(dbRef, "push dbRef")
    // dbRef = push();  
    let key = dbRef.key;
    console.log(key, "push dbRef key")
    window.history.replaceState( null ,"",`?roomId=${key}`);
}