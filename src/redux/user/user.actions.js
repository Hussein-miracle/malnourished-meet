import UserActionTypes from "./user.types";

export const addMeetJoiner = (meetJoinerDetails) => {
    return {
        type:UserActionTypes.ADD_PERSON,
        payload:meetJoinerDetails
    }
}


export const deleteMeetJoiner = (meetJoinerId) => {
    return {
        type:UserActionTypes.DELETE_PERSON,
        payload:meetJoinerId
    }
}


export const setCurrentUser = (user) => {
    return {
        type:UserActionTypes.SET_CURRENT_USER,
        payload:user
    }
} 