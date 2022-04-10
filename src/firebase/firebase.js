// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase , ref ,child , push} from  "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCq-UEXRgu1uxj5YdQQPNpdGQynjdApToM",
//   authDomain: "malnourished--meet.firebaseapp.com",
//   databaseURL: "https://malnourished--meet-default-rtdb.firebaseio.com",
//   projectId: "malnourished--meet",
//   storageBucket: "malnourished--meet.appspot.com",
//   messagingSenderId: "529985134607",
//   appId: "1:529985134607:web:e737a1b4a8c6cacbbc437a"
// };
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID
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