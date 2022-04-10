import './App.css';
import { useContext , useEffect } from 'react';
import { useSelector, useDispatch , connect } from 'react-redux';
import { onValue , child , push , onDisconnect ,onChildAdded , onChildRemoved} from "firebase/database";
import {dbRef , connectedRef ,userName } from "./firebase/firebase";


import {addMeetJoiner , deleteMeetJoiner , setCurrentUser} from "./redux/user/user.actions";
// import InputContextProvider,{InputContext} from './context/input-context/input-context';
// import Input from "./components/input/input.component";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser); 
  const meetJoiners = useSelector((state) => state.user.meetJoiners); 
  const dispatch = useDispatch();
  console.log(currentUser)
  // const {userName} = useContext(InputContext);

  const meetJoinersRef = child(dbRef,"meet-joiners");

  useEffect(()=>{

    onValue(connectedRef, snapshot => {

      console.log(snapshot, "data snap");

      const data = snapshot.val();

      console.log(data, "[data]")

      if(data === true){

        const joinerData = {
          userName,
          joinerInitialSettings:{
            video:true,
            audio:true,
            screenAccess:false
          }
        }




        const joinersRef = push(meetJoinersRef,joinerData);
        
        dispatch(setCurrentUser({
          [joinersRef.key]:{
            ...joinerData
          }
        }))


        onDisconnect(joinersRef).remove().catch(err => {
          if (err) {
            console.error("could not establish onDisconnect event", err);
          }
        })
      }
    })


  },[])

  useEffect(()=>{

    if(currentUser){
      onChildAdded(meetJoinersRef,snapshot => {
        const {userName,joinerInitialSettings} = snapshot.val();

        dispatch(addMeetJoiner({[snapshot.key]:{userName,...joinerInitialSettings}}))
      })

      onChildRemoved(meetJoinersRef, (snapshot) => {dispatch(deleteMeetJoiner(snapshot.key))
        })
    }

  },[currentUser])

  return (
    <div className="App">
      <h1>Yo  {userName && userName}!</h1>
      currentUser{JSON.stringify(currentUser)}
      <br/>
      joiners{JSON.stringify(meetJoiners)}
    </div>
  );
}

export default App;
