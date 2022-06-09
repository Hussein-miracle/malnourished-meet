import UserActionTypes from "./user.types";

export const addMeetJoiner = (meetJoinerDetails) => {
    return {
        type:UserActionTypes.ADD_PERSON,
        payload:meetJoinerDetails
    }
}


export const updateCurrentUser = (user) => {
  return {
    type: UserActionTypes.UPDATE_CURRENT_USER,
    payload:user
  };
};



export const updateMeetJoiners = (user) => {
  return {
    type:UserActionTypes.UPDATE_MEETJOINER,
    payload:user 
  };
};

export const setMainStream = (stream) => {
  return {
    type: UserActionTypes.SET_MAIN_STREAM,
    payload: stream
  };
};


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