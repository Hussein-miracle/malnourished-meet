import React,{useRef , useEffect } from "react";
import "./home.styles.scss";
import {useSelector,useDispatch} from "react-redux";
import Controls from "../controls/controls.component";
import HomeScreen from "../home-screen/home-screen.component";
import { setMainStream , updateCurrentUser } from "../../redux/user/user.actions" ;

const Home = () => {
  const dispatch = useDispatch();
  const stream = useSelector((state) => state.user.mainStream); 
  const meetJoiners = useSelector((state) => state.user.meetJoiners)
  const currentUser = useSelector((state) => state.user.currentUser);
  const meetJoinersRef = useRef(meetJoiners);

  const handleMicClick = (micEnabled) => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = micEnabled;
      dispatch(updateCurrentUser({ audio: micEnabled }));
    }
  };

  
  const handleCamClick = (videoEnabled) => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = videoEnabled;
      dispatch( updateCurrentUser({ video: videoEnabled }) ) ;
    }
  };

  useEffect(() => {
    meetJoinersRef.current = meetJoiners;
  }, [meetJoiners]); 

  const updateStream = (stream) => {
    for (let key in meetJoinersRef.current) {

      const sender = meetJoinersRef.current[key];

      if (sender.currentUser) continue;

      const peerConnection = sender.peerConnection.getSenders().find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnection.replaceTrack(stream.getVideoTracks()[0]);
    }
    dispatch(setMainStream(stream));

  };

  const handleScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled = Object.values(
      currentUser
    )[0].video;

    updateStream(localStream);

    dispatch(updateCurrentUser({screen: false }));
  };

  const handleShareScreenClick = async () => {
    let mediaStream;
    if (navigator.getDisplayMedia) {
      mediaStream = await navigator.getDisplayMedia({ video: true });
      
    } else if (navigator.mediaDevices.getDisplayMedia) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { mediaSource: "screen" },
      });
    }

    mediaStream.getVideoTracks()[0].onended = handleScreenShareEnd;

    updateStream(mediaStream);

    dispatch( updateCurrentUser({ screen: true }) ) ;
  };
    return(
        <div className="home">
            <main className="home__content">
                <HomeScreen/>
            </main>
            <footer className="home__footer">
                <Controls
                handleShareScreenClick={handleShareScreenClick}
                handleMicClick={handleMicClick} 
                handleCamClick={handleCamClick}

                />
            </footer>
        </div>
    )
}

export default Home;