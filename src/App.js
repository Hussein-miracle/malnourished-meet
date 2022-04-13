import './App.css';
import { useContext , useEffect } from 'react';
import { useSelector, useDispatch , connect } from 'react-redux';
import { onValue , child , push , onDisconnect ,onChildAdded , onChildRemoved , onChildChanged} from "firebase/database";
import {dbRef , connectedRef ,userName } from "./firebase/firebase";

import Home from "./components/home/home.component";

// import {} from "../../redux/user/user.actions" ;
import {addMeetJoiner , deleteMeetJoiner , setCurrentUser ,  setMainStream , updateCurrentUser, updateMeetJoiners } from "./redux/user/user.actions";
// import InputContextProvider,{InputContext} from './context/input-context/input-context';
// import Input from "./components/input/input.component";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser); 
  const meetJoiners = useSelector((state) => state.user.meetJoiners); 
  const stream = useSelector((state) => state.user.mainStream); 
  const dispatch = useDispatch();
  // console.log(currentUser)
  // const {userName} = useContext(InputContext);

  const meetJoinersRef = child(dbRef,"meet-joiners");

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };

  useEffect( async ()=>{
    const stream = await getUserStream();
    console.log(stream, "stream")
    console.log(stream.getVideoTracks(), "stream videoTracks");

    stream.getVideoTracks()[0].enabled = false;

    dispatch(setMainStream(stream));

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

  
  // const meetJoinersRef = child(dbRef,"meet-joiners");

  const isUserSet = !!currentUser;
  const isStreamSet = !!stream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {

     onChildAdded( meetJoinersRef , (snap) => {
        const preferenceUpdateEvent = child( child(meetJoinersRef , snap.key)  , "joinerInitialSettings");


        onChildChanged(preferenceUpdateEvent , (preferenceSnap) => {
          dispatch( updateMeetJoiners({
            [snap.key]: {
              [preferenceSnap.key]: preferenceSnap.val(),
            },
          }) );
        });


        const { userName , joinerInitialSettings = {} } = snap.val();

        dispatch( addMeetJoiner({
          [snap.key]: {
            userName,
            ...joinerInitialSettings,
          },
        }) ) ;
      });


      onChildRemoved( meetJoinersRef , (snap) => {

        dispatch(deleteMeetJoiner(snap.key));
      });
    }
  }, [isStreamSet, isUserSet])
  
  
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
