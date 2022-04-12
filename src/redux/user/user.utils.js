import { addConnection } from "../../WebRTC/WebRTC.utils";

export const addPerson = (userDetails,mainStream,personDetails,allJoiners) => {

    const currentUserId = Object.keys(userDetails)[0];

    const meetJoinerId = Object.keys(personDetails)[0];

    console.log(meetJoinerId,"meetJoinerId");
    console.log(currentUserId,"userId");
    if (mainStream && currentUserId !== meetJoinerId) {
        personDetails = addConnection( personDetails ,userDetails , mainStream);
    }

    if(currentUserId === meetJoinerId) {
        personDetails[meetJoinerId].currentUser = true;
    }

    personDetails[meetJoinerId].photoURLColor = randomColor();


    return {
        ...allJoiners,...personDetails
    }



}

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`; 