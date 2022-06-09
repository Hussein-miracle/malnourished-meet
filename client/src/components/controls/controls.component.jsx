import React,{useState , useEffect } from 'react';
import {useSelector,useDispatch} from "react-redux";
import ReactTooltip from "react-tooltip";
import "./controls.styles.scss";
import { ReactComponent  as VideoCamOnIcon } from '../../assets/icons/videoCamOn.svg';
import { ReactComponent  as VideoCamOffIcon } from '../../assets/icons/videoCamOff.svg';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallEndIcon from '@mui/icons-material/CallEnd';


 
const  Controls = ({handleMicClick,handleShareScreenClick,handleCamClick}) => {
  const [streamState, setStreamState] = useState({
    micOn: true,
    camOn: true,
    screen: false,
    captionOn:false
  });

  useEffect(() => {
    handleMicClick(streamState.micOn);
  }, [streamState.micOn]);
  
  useEffect(() => {
    handleCamClick(streamState.camOn);
  }, [streamState.camOn]);

  




  const handleShareScreen = () => {
    handleShareScreenClick();
  };

  const setScreenState = (isEnabled) => {
    setStreamState((prevState) => {
      return {
        ...prevState,
        screen: isEnabled,
      };
    });

    return streamState.screen;
  };

  const handleClickCaption = () => {

    setStreamState((prevState) => {
      return {
        ...prevState, 
        captionOn: !prevState.captionOn,
      };
    });
  }
  const handleClickMic = (e) => {
    setStreamState((prevState) => {
      return {
        ...prevState,
        micOn: !prevState.micOn,
      };
    });
  }
  const handleClickCam = () => {
    setStreamState((prevState) => {
      return {
        ...prevState,
        camOn: !prevState.camOn,
      };
    });
  }
  return (
    <div className="controls">




      <button  data-tip={streamState.micOn ? "Mute Mic" : "Unmute Mic"}  className={`controls__btn ${ streamState.micOn === false ? "off" : "" }`}  onClick={handleClickMic} >
        {streamState.micOn ? <MicIcon/> : <MicOffIcon/>}
        
      </button>



      <button  data-tip={streamState.camOn ? "Close Cam" : "Open Cam"}  className={`controls__btn ${ streamState.camOn === false ? "off" : "" }`}   onClick={handleClickCam} >
        {streamState.camOn ? <VideoCamOnIcon/> : <VideoCamOffIcon />}        
      </button>




      <button data-tip={streamState.captionOn ? "disable caption" : "show caption"}   className={`controls__btn ${ streamState.captionOn ? "caption" : "" }`}  onClick={handleClickCaption}>

        {streamState.captionOn ? <ClosedCaptionOffIcon/> : <ClosedCaptionOffIcon/>}
        
      </button>






      <button className="controls__btn" data-tip="Share Screen " disabled={streamState.screen} onClick={handleShareScreen}>
        <PresentToAllIcon/>
      </button>
      <button className="controls__btn" data-tip="More Options">
        <MoreVertIcon/>
      </button>
      <button className="controls__btn-call"  data-tip="Leave Meet">
        <CallEndIcon/>
      </button>
      <ReactTooltip />
    </div>
  )
}

export default  Controls;