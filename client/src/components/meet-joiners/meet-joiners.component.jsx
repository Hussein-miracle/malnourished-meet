import React ,{useEffect,useRef} from 'react';
import { useSelector } from "react-redux";
import "./meet-joiners.styles.scss";
import MeetJoiner from '../meet-joiner/meet-joiner.component';
const MeetJoiners = () => {
  const videoRef = useRef(null);
  const meetJoiners = useSelector((state) => state.user.meetJoiners);
  const stream = useSelector((state) => state.user.mainStream);
  const meetJoinersIds = Object.keys(meetJoiners);


  const currentUserData = useSelector((state) => state.user.currentUser);

  console.log(currentUserData , "current user d")
  const currentUser = currentUserData ? Object.values(currentUserData)[0]    : null;
  // console.log(currentUser ,"[cur user meetjoiners component]")


  let gridCol = meetJoinersIds.length <= 4 ? 1 : 2;
  let gridRow = meetJoinersIds.length <= 4 ? meetJoinersIds.length : Math.ceil(meetJoinersIds.length / 2);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = currentUser.audio; 
    }
  }, [currentUser,stream]);

  

  const findScreenSharer = meetJoinersIds.find((element) => {
    const currentJoiner = meetJoiners[element];

    return currentJoiner.screen;
  });

  if (findScreenSharer) {
    gridCol = 1;
    gridRow = 2;
  }


  const joiners = meetJoinersIds.map((meetJoinerId, index) => {

    console.log(index)

    const curJoiner = meetJoiners[meetJoinerId];
    // console.log(curJoiner, "joineer")
    const isCurrentUser = curJoiner.currentUser;

    if (isCurrentUser) {
      return null;
    }
    const peerCon = curJoiner.peerConnection;
    
    const remoteStream = new MediaStream();

    let currentIndex = index;

    if (peerCon) {
      peerCon.ontrack = (event) => {
        console.log(event    , "[peerCon meet-joiners comp event]")

        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });


        const videoElement = document.getElementById(
          `meetJoinerCam${currentIndex}`
        );


        if(videoElement) videoElement.srcObject = remoteStream;
      };
    }

    return (

      <MeetJoiner
        key={currentIndex}
        curJoiner={curJoiner} 
        data={curJoiner}
        currentIndex={currentIndex} 
        hideVideo={findScreenSharer && findScreenSharer !== meetJoinerId}
        showPhoto={ (curJoiner?.video === false && curJoiner?.screen === false)  ?  true : false
        }
      />
    );
  });


  if(currentUserData === null) return <></>;

  return (
    <div className="meet-joiners" style={{  
      "--grid-col":gridCol,
      "--grid-row":gridRow
    }}> 

      {joiners} 

      <MeetJoiner

        // key={meetJoinersIds.length} 

        curJoiner={currentUser} 
        currentIndex={meetJoinersIds.length - 1}
        hideVideo={findScreenSharer && !currentUser.screen}

        showPhoto={ currentUser?.joinerInitialSettings?.video === false && currentUser?.joinerInitialSettings?.screen === false ? true : false }

        camRef={videoRef}

        currentUser
      />
      
    </div>
  )
}

export default MeetJoiners;