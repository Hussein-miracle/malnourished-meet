import React from 'react';
import "./screen.styles.scss";

const SharedScreen = ({children}) => {
  return (
    <div className="screen">{children}</div>
  )
}

export default SharedScreen;