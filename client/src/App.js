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

  const streamData = useSelector((state) => state.user.mainStream); 
  const dispatch = useDispatch();
  // console.log(currentUser)
  // const {userName} = useContext(InputContext);

  const meetJoinerRef = child( dbRef ,"meet-joiners");
  
  
const getUserStream = async () => {
    const mediaConstraints = {
      audio: true,
      video: true,
    }
    
    const userStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    return userStream;
};

  

  useEffect( ()=>{

    const handleGetStreamAndDispatch = async() => {
      const stream = await getUserStream();
      console.log(stream, "stream")
      console.log(stream.getVideoTracks(), "stream videoTracks");

      stream.getVideoTracks()[0].enabled = false;

      dispatch(setMainStream(stream));

      onValue( connectedRef , (snapshot) => {
        console.log("connectedRef snapshot", snapshot);
        console.log("connectedRef snapshot Value", snapshot.val());

        let isConnected = snapshot.val();

        if(!!isConnected){
          const joinerData = {
            userName,
            joinerInitialSettings:{
              video:true,
              audio:!true,
              screen:!true
            }
          }


          const joinerRefStat = push(meetJoinerRef,joinerData);

          console.log("joinersRefStat app",joinerRefStat);
          console.log("joinersRefStat app.js key",joinerRefStat.key);

          dispatch(
            setCurrentUser({
              [joinerRefStat.key]:{
                ...joinerData
              }
            })
          );


          console.log("userData in going to state from App.js")

          onDisconnect(joinerRefStat).remove().catch(err => {
            if (err) {
              console.error("could not establish onDisconnect event", err);
            }
          })

        }

      
            
      
      })

    }

    handleGetStreamAndDispatch();
    

  },[currentUser])


  const isUser = !!currentUser;
  const isStream = !!streamData;

  useEffect( () => {
    if (isStream && isUser) {

     onChildAdded( meetJoinerRef , (snap) => {

        const initialSettingsUpdateRef = child(meetJoinerRef , `${snap.key}/joinerInitialSettings`);


        onChildChanged(initialSettingsUpdateRef , (initialSettingSnap) => {
          dispatch( updateMeetJoiners({
            [snap.key]: {
              [initialSettingSnap.key]: snap.val(),
            },
          }) );
        });


        const { userName , joinerInitialSettings } = snap.val();

        dispatch( addMeetJoiner( {
          [snap.key]: {
            userName,
            ...joinerInitialSettings,
          },
        } ) );


      });


      onChildRemoved( meetJoinerRef , (snap) => {    dispatch(deleteMeetJoiner(snap.key));
      });
    }
  }, [isStream, isUser])
  
  
  

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
