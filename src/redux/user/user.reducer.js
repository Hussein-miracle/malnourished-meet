import UserActionTypes from "./user.types";
import {initializeListeners,updatePreference } from "../../WebRTC/WebRTC.utils";
import { addPerson   , randomColor} from "./user.utils";

const INITIAL_STATE = {
    currentUser:null,
    meetJoiners:{},
    mainStream:null
}




const userReducer = (state=INITIAL_STATE,action) => {

    switch(action.type){

        case UserActionTypes.SET_CURRENT_USER:
            const userId = Object.keys(action.payload)[0]; 

            action.payload[userId].photoURLColor = randomColor();    

            initializeListeners(userId);

            return {
                ...state,
                currentUser:action.payload
            };
        case UserActionTypes.UPDATE_CURRENT_USER:
            const Id = Object.keys(state.currentUser)[0];
            
            updatePreference(Id, action.payload);

            state.currentUser[Id] = {
            ...state.currentUser[Id],
            ...action.payload,
            };

            return {
                ...state,
                currentUser:{...state.currentUser}
            };

        case UserActionTypes.SET_MAIN_STREAM:
            return {
                ...state,
                mainStream:action.payload
            };

        case UserActionTypes.UPDATE_MEETJOINER:

            const newUserId = Object.keys(action.payload)[0];
            
            action.payload[newUserId] = {
            ...state.meetJoiners[newUserId],
            ...action.payload[newUserId],
            }

            return {
                ...state,
                meetJoiners:{...state.meetJoiners , ...action.payload}
            };

        case UserActionTypes.ADD_PERSON:
            return {
                ...state,
                meetJoiners:{...addPerson(state.currentUser,state.mainStream,action.payload,state.meetJoiners)}
            };


        case UserActionTypes.DELETE_PERSON:
            delete state.meetJoiners[action.payload];
            return {
                ...state,meetJoiners:{...state.meetJoiners} 
            };

        default:
            return state;
    }
}
export default userReducer;