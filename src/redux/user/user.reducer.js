import UserActionTypes from "./user.types";
const INITIAL_STATE = {
    currentUser:null,
    meetJoiners:{},

}

const userReducer = (state=INITIAL_STATE,action) => {
    switch(action.type){
        case UserActionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser:action.payload
            }
            
        case UserActionTypes.ADD_PERSON:
            const currentUserData = Object.keys(state.currentUser);
            const currentUserId = currentUserData[0];
            console.log(currentUserId);
            const meetJoinerId = Object.keys(action.payload)[0];
            console.log(meetJoinerId,"meetJoinerId");

            if(currentUserId === meetJoinerId) {
                action.payload[meetJoinerId].currentUser = true;
            }
            return {
                ...state,
                meetJoiners:{...state.meetJoiners,...action.payload}
            }
        case UserActionTypes.DELETE_PERSON:
            delete state.meetJoiners[action.payload];
            return {
                ...state,meetJoiners:{...state.meetJoiners} }
        default:
            return state;
    }
}
export default userReducer;