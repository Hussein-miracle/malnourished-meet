import React , {useState , useContext} from 'react'
import { InputContext } from '../../context/input-context/input-context';
import "./input.styles.scss";

const Input = () => {
    const {setUserName , userName} = useContext(InputContext);
     
    const handleChange = (e) => {
        setUserName(e.target.value);
    }

  return (
    <div className="input-container">
        <label htmlFor="input-name">
          What's your name?
        
        
        </label>
        <input className="input" type="text" id="input-name" onChange={handleChange}/>
        <button className="input-btn">Ok</button>
    </div>
  )
}

export default Input;