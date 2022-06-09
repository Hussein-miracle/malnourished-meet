import {createContext ,useState} from "react";

export const InputContext =  createContext({
    name:'',
});

const InputContextProvider = ({children}) => {
    const [name,setName] = useState("");
    const value = {name , setName};
    return (
        <InputContext.Provider value={value}>{children}</InputContext.Provider>
    )
}

export default InputContextProvider;