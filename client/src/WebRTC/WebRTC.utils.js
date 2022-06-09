import { dbRef } from "../firebase/firebase";
import { store } from "../redux/store";
import { onChildAdded , child , push , set , update } from "@firebase/database";

const meetJoinersRef = child( dbRef,"meet-joiners");

console.log(meetJoinersRef,"joiners ref @webRtcUTILS")

const iceServers = {
  'iceServer': [
    {'urls':'stun:stun.l.google.com:19302'},
    {'urls':'stun:stun.services.mozilla.com'},
  ]

};


// const serverConfig = {
//   iceServers: [
//     {
//       urls: [
//         "stun:stun1.l.google.com:19302",
//         "stun:stun2.l.google.com:19302",
//         "stun:stun.l.google.com:19302",
//         "stun:stun3.l.google.com:19302",
//         "stun:stun4.l.google.com:19302",
//         "stun:stun.services.mozilla.com",
//       ],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };



export const updateSettings = (userId, settings) => {

  
  const currentJoinerRef = child(meetJoinersRef ,`${userId}/joinerInitialSettings`)
  ;

  console.log(currentJoinerRef,userId , "currentJoinerRef joinerInitialSettings, userID ")
  console.log(currentJoinerRef.val(),userId , "currentJoinerRef joinerInitialSettings, userID value ")

  setTimeout(() => {
    update(currentJoinerRef , settings);
  });

};

export const createOffer = async (peerConnection , receiverId , createdID) => {

  const currentMeetJoinerRef = child(meetJoinersRef , `${receiverId}/offerCandidates`);

  console.log(currentMeetJoinerRef , "currentMeetJoinerRef  offerCandidates")

  console.log(currentMeetJoinerRef.val() , "currentMeetJoinerRef  offerCandidates val")
  
  peerConnection.onicecandidate = (event) => {  
    console.log("oncandidate event webrtcUtils", event);
    console.log("event candidate webrtcUtils", event.candidate);
    return event.candidate && push(currentMeetJoinerRef , { ...event.candidate.toJSON(),userId: createdID });
  };

  const offerDescription = await peerConnection.createOffer();

  // console.log(offerDescription , "offerDescription")

  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  const offersRef = child(currentMeetJoinerRef,"offers");


  const newOffersRef = push(offersRef);

  console.log("newOffersRef webrtc utils",newOffersRef);
  console.log("newOffersRef webrtc utils val",newOffersRef.val());

  await set( newOffersRef , { offer });
};





export const initializeListeners = async (userId) => {

  const currentUserRef = child( meetJoinersRef, `${userId}/offers`);

  console.log(currentUserRef,"currentUserofferRef offers")
  console.log(currentUserRef.val(),"currentUserofferRef offers val")

  onChildAdded(currentUserRef , async (snapshot) => {

    const data = snapshot.val();

    if (data?.offer) {

      console.log(data.offer,store.getState().user.meetJoiners , "offer data getState")

      const peerConnection = store.getState().user.meetJoiners[data.offer.userId].peerConnection;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

      await createAnswer(data.offer.userId, userId);
    }
  });

  const offerCandidatesRef = child(currentUserRef , "offerCandidates");
  console.log(offerCandidatesRef ,"offCanditdates Ref")
  onChildAdded(offerCandidatesRef , (snapshot) => {

    const data = snapshot.val();

    if (data.userId) {
      const peerConnection = store.getState().user.meetJoiners[data.userId].peerConnection;

      console.log("peerConnection from userId",peerConnection);


      const iceCandidate = new RTCIceCandidate(data);

      console.log("iceCandiafdat web rct utils",iceCandidate)

      peerConnection.addIceCandidate(iceCandidate)

    }
  });


  const answersRef = child(currentUserRef , "answers")
  console.log(answersRef , "answersRef")

  onChildAdded( answersRef , (snapshot) => {

    const data = snapshot.val();

    if (data?.answer) {
      const peerConnection = store.getState().user.meetJoiners[data.answer.userId].peerConnection;
      console.log(peerConnection,"peerConnection")

      const answerDescription = new RTCSessionDescription(data.answer);

      console.log(answerDescription,"answerDescription")

      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  const answerCandidatesRef = child(currentUserRef , "answerCandidates") 
  console.log(answerCandidatesRef ,"answerCandidatesRef ")
  onChildAdded(answerCandidatesRef , (snapshot) => {

    const data = snapshot.val();

    if (data.userId) {

      const pc = store.getState().user.meetJoiners[data.userId].peerConnection;

      pc.addIceCandidate(new RTCIceCandidate(data));

    }
  });
};

const createAnswer = async (otherUserId, userId) => {

  const pc = store.getState().user.meetJoiners[otherUserId].peerConnection;

  console.log(pc,"peer connection")

  const answerCandidates = child(meetJoinersRef , `${otherUserId}/answerCandidates`);

  // const answerCandidates = child(participantRef1 , "answerCandidates") 

  console.log(answerCandidates ,"answerCandidates")

  pc.onicecandidate = (event) => { event.candidate && push(answerCandidates , { ...event.candidate.toJSON(), userId: userId });
  };

  const answerDescription = await pc.createAnswer();

  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await set(push(child(answerCandidates ,"answers")) , { answer });
};



export const addConnection = (newUser, currentUser, stream) => {

  const peerConnection = new RTCPeerConnection(iceServers);

  stream.getTracks().forEach((track , i) => {
    console.log(track,i , `[addConnection track]${i}`) 
    peerConnection.addTrack(track, stream);
  });


  const newUserId = Object.keys(newUser)[0];

  const currentUserId = Object.keys(currentUser)[0];

  const offerIds = [newUserId, currentUserId].sort((a, b) =>
    a.localeCompare(b)
  );

  newUser[newUserId].peerConnection = peerConnection;

  if (offerIds[0] !== currentUserId) createOffer(peerConnection, offerIds[0], offerIds[1]);

  return newUser;
};