import React,{useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import "./meet-joiner.styles.scss";

import MicOffIcon from '@mui/icons-material/MicOff';
import Screen from "../screen/screen.component";

const MeetJoiner = ({currentIndex,curJoiner,hideVideo,camRef,showPhoto,currentUser}) => {
  console.log(curJoiner)
  const [user ,setUser]= useState(null)
  const [curUser ,setCurUser]= useState(null)
  const currentUserData = useSelector((state) => state.user.currentUser); 

  useEffect(()=> {
    if(!!currentUserData){
    const {userName,currentUser} = currentUserData[Object.keys(currentUserData)[0]];
    // console.log("user ineer",user);
    setUser(userName)
    setCurUser(currentUser)
  } 
  },[currentUserData , curJoiner])

  if (!curJoiner){
    return null;

  }

  const {joinerInitialSettings,userName,photoURLColor} = curJoiner; 

  
  

  


  return (
    <div className={`meet-joiner ${hideVideo ? "hidden" : ""}`}>

      <Screen>
        <video 
        ref={camRef}
      
          id={`meetJoinerCam${currentIndex}`}
        autoPlay  playsInline></video>


        <MicOffIcon title="Muted"  className={`mic-off ${ !curUser?.joinerInitialSettings?.audio ? "hidden" : ""}`}/>

        <div className="photo" style={{
          backgroundColor:photoURLColor
        }}>{ showPhoto && userName[0].toUpperCase()}</div>


        <div className="display-name">
          {userName} <span> {currentUser ?  "(You)" : ""}</span>
        </div>
      </Screen>
    </div>
  )
}

export default MeetJoiner;