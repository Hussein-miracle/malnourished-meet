import React from 'react';
import "./home-screen.styles.scss";
import MeetJoiners from "../meet-joiners/meet-joiners.component";
const HomeScreen = () => {
  return (
    <div className="home-screen">
      <MeetJoiners/>
    </div>
  )
}

export default HomeScreen;