import {createContext ,useState} from "react";

export const InputContext =  createContext();

const InputContextProvider = ({children}) => {
    const [userName,setUserName] = useState("");
    return (
        <InputContext.Provider value={{userName , setUserName}}>{children}</InputContext.Provider>
    )
}

export default InputContextProvider;