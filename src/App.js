import './App.css';
import { useContext , useEffect } from 'react';
import { useSelector, useDispatch , connect } from 'react-redux';
import { onValue , child , push , onDisconnect ,onChildAdded , onChildRemoved} from "firebase/database";
import {dbRef , connectedRef ,userName } from "./firebase/firebase";

import Home from "./components/home/home.component";


import {addMeetJoiner , deleteMeetJoiner , setCurrentUser} from "./redux/user/user.actions";
// import InputContextProvider,{InputContext} from './context/input-context/input-context';
// import Input from "./components/input/input.component";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser); 
  const meetJoiners = useSelector((state) => state.user.meetJoiners); 
  const dispatch = useDispatch();
  // console.log(currentUser)
  // const {userName} = useContext(InputContext);

  const meetJoinersRef = child(dbRef,"meet-joiners");

  useEffect(()=>{

    onValue(connectedRef, snapshot => {

      // console.log(snapshot, "data snap");

      const connected = snapshot.val();

      // console.log(connected, "[connected]")

      if(connected === true){

        const joinerData = {
          userName,
          joinerInitialSettings:{
            video:true,
            audio:true,
            screen:true,
            caption:false
          }
        }




        const joinerRef = push(meetJoinersRef,joinerData);

        
        dispatch(setCurrentUser({
          [joinerRef.key]:{
            ...joinerData
          }
        }))


        onDisconnect(joinerRef).remove().catch(err => {
          if (err) {
            console.error("could not establish onDisconnect event", err);
          }
        })
      }
    })


  },[])

  useEffect(()=>{

    if(currentUser){

      onChildAdded(meetJoinersRef, (snapshot) => {

        const {userName,joinerInitialSettings} = snapshot.val();

        dispatch(addMeetJoiner({[snapshot.key]:{userName,...joinerInitialSettings}}))
      })


      onChildRemoved(meetJoinersRef, (snapshot) => {dispatch(deleteMeetJoiner(snapshot.key))})
    }

  },[currentUser])

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
