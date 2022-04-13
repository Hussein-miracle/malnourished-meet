import { dbRef } from "../firebase/firebase";
import { store } from "../redux/store";
import { onChildAdded , child , push , set , update } from "@firebase/database";

const participantRef = child(dbRef,"meet-joiners");

const serverConfig = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};



export const updatePreference = (userId, preference) => {
  const currentParticipantRef = child( child(participantRef ,userId ),"joinerInitialSettings")
  ;

  setTimeout(() => {
    update(currentParticipantRef , preference);
  });

};

export const createOffer = async (peerConnection , receiverId , createdID) => {

  const currentParticipantRef = child(participantRef , receiverId);
  
  peerConnection.onicecandidate = (event) => { event.candidate && push(child(currentParticipantRef,"offerCandidates") , { ...event.candidate.toJSON(),userId: createdID });
  };

  const offerDescription = await peerConnection.createOffer();

  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  await set(push(child(currentParticipantRef,"offers")) , { offer });
};

export const initializeListeners = async (userId) => {

  const currentUserRef = child( child(participantRef , userId) ,"offers");

  onChildAdded(currentUserRef , async (snapshot) => {

    const data = snapshot.val();

    if (data?.offer) {

      console.log(data.offer,store.getState().user.meetJoiners , "offer data getState")
      const pc = store.getState().user.meetJoiners[data.offer.userId].peerConnection;

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

      await createAnswer(data.offer.userId, userId);
    }
  });

  onChildAdded(child(currentUserRef , "offerCandidates"), (snapshot) => {

    const data = snapshot.val();

    if (data.userId) {
      const pc = store.getState().user.meetJoiners[data.userId].peerConnection;

      pc.addIceCandidate(new RTCIceCandidate(data));

    }
  });

  onChildAdded( child(currentUserRef , "answers") , (snapshot) => {

    const data = snapshot.val();

    if (data?.answer) {
      const peerConnection = store.getState().user.meetJoiners[data.answer.userId].peerConnection;

      const answerDescription = new RTCSessionDescription(data.answer);

      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(child(currentUserRef , "answerCandidates") , (snapshot) => {

    const data = snapshot.val();

    if (data.userId) {

      const pc = store.getState().user.meetJoiners[data.userId].peerConnection;

      pc.addIceCandidate(new RTCIceCandidate(data));

    }
  });
};

const createAnswer = async (otherUserId, userId) => {

  const pc = store.getState().user.meetJoiners[otherUserId].peerConnection;

  const participantRef1 = child(participantRef , otherUserId);

  pc.onicecandidate = (event) => { event.candidate && push(child(participantRef1 , "answerCandidates") , { ...event.candidate.toJSON(), userId: userId });
  };

  const answerDescription = await pc.createAnswer();

  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await set(push(child(participantRef1,"answers")) , { answer });
};



export const addConnection = (newUser, currentUser, stream) => {

  const peerConnection = new RTCPeerConnection(serverConfig);

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