import React from 'react';
import "./screen.styles.scss";

const Screen = ({children}) => {
  return (
    <div className="screen">{children}</div>
  )
}

export default Screen;