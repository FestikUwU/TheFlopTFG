import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs, addDoc, orderBy, onSnapshot, limit, deleteDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

//configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBU7qvBSHZA1ekL3OfCDtfDXEF8b7pQp3k",
  authDomain: "theflop-4e5e5.firebaseapp.com",
  databaseURL: "https://theflop-4e5e5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "theflop-4e5e5",
  storageBucket: "theflop-4e5e5.firebasestorage.app",
  messagingSenderId: "1069956289464",
  appId: "1:1069956289464:web:3c0627a595a8144338354d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const storage = getStorage(app);


// Función para enviar un mensaje
export const sendMessage = (message: string) => {
  const user = auth.currentUser;

  if (!user) return;

  const messagesRef = ref(database, 'messages');
  push(messagesRef, {
    text: message,
    user: user.displayName ?? user.email,
    uid: user.uid,
    timestamp: Date.now()
  });
};

export const uploadPhoto = async (file: File) => {

  const user = auth.currentUser;
  if (!user) return null;

  const filePath = `users/${user.uid}/${Date.now()}_${file.name}`;

  const fileRef = storageRef(storage, filePath);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return url;
};

// Función para escuchar mensajes en tiempo real
export const subscribeMessages = (callback: (data: any) => void) => {
  const messagesRef = ref(database, 'messages');
  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    callback(messages);
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, {
    displayName: name
  });

  return cred.user;
};

export const likeUser = async (targetUid: string): Promise<boolean> => {

  const user = auth.currentUser;
  if (!user) return false;

  const likeRef = doc(
    firestore,
    "interactions",
    user.uid,
    "likes",
    targetUid
  );

  await setDoc(likeRef, {
    liked: true,
    timestamp: Date.now()
  });

  const likeBackRef = doc(
    firestore,
    "interactions",
    targetUid,
    "likes",
    user.uid
  );

  const snap = await getDoc(likeBackRef);

  if (snap.exists()) {

    const matchId =
      user.uid < targetUid
        ? `${user.uid}_${targetUid}`
        : `${targetUid}_${user.uid}`;

    const matchRef = doc(firestore, "matches", matchId);

    await setDoc(matchRef, {
      users: [user.uid, targetUid],
      createdAt: Date.now(),
      notifiedUsers: []
    });

    return true;
  }

  return false;
};

export const dislikeUser = async (targetUid: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const dislikeRef = doc(
    firestore,
    "interactions",
    user.uid,
    "dislikes",
    targetUid
  );

  await setDoc(dislikeRef, {
    disliked: true,
    timestamp: Date.now()
  });
};

export const checkMatch = async (targetUid: string) => {
  const user = auth.currentUser;
  if (!user) return false;

  const likeRef = doc(
    firestore,
    "interactions",
    targetUid,
    "likes",
    user.uid
  );

  const snap = await getDoc(likeRef);

  return snap.exists();
};

export const createMatch = async (targetUid: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const matchId =
    user.uid < targetUid
      ? `${user.uid}_${targetUid}`
      : `${targetUid}_${user.uid}`;

  const matchRef = doc(firestore, "matches", matchId);

  await setDoc(matchRef, {
    users: [user.uid, targetUid],
    createdAt: Date.now()
  });
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const saveUserProfile = async (data: {
  public?: {
    description: string;
    age: number | null;
    gender: string;
    photos: string[];
  };
  private?: {
    location: string;
    lookingGender: string;
    ageMin: number;
    ageMax: number;
    interests: string[];
  };
  tutorials?: {
    profileSeen?: boolean;
    homeSeen?: boolean;
  };
}) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(firestore, 'users', user.uid);

  await setDoc(userRef, data, { merge: true });
};

export const getUserMatches = async () => {

  const user = auth.currentUser;
  if (!user) return [];

  const matchesRef = collection(firestore, "matches");
  const snapshot = await getDocs(matchesRef);

  const matches:any[] = [];

  snapshot.forEach(doc => {
    const data: any = doc.data();

    if (data['users'].includes(user.uid)) {
      matches.push({
        id: doc.id,
        users: data['users']
      });
    }
  });

  return matches;
};


export const sendChatMessage = async (matchId: string, text: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const messagesRef = collection(firestore, "chats", matchId, "messages");

  await addDoc(messagesRef, {
    text,
    sender: user.displayName ?? "Player",
    senderUid: user.uid,
    timestamp: Date.now(),

    seenBy: [user.uid]
  });
};

export const subscribeToChat = (matchId: string, callback: (messages: any[]) => void) => {

  const messagesRef = collection(firestore, "chats", matchId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const msgs: any[] = [];
    snapshot.forEach(doc => {
      msgs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(msgs);
  });
};

export const deleteChatFromFirestore = async (matchId: string) => {

  const user = getAuth().currentUser;
  if (!user) return;

  const matchRef = doc(firestore, "matches", matchId);
  const matchSnap = await getDoc(matchRef);

  if (!matchSnap.exists()) return;

  const data: any = matchSnap.data();
  const otherUid = data.users.find((uid: string) => uid !== user.uid);

  const messagesRef = collection(firestore, "chats", matchId, "messages");
  const snapshot = await getDocs(messagesRef);

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  await deleteDoc(matchRef);

  const likeRef1 = doc(firestore, "interactions", user.uid, "likes", otherUid);
  const likeRef2 = doc(firestore, "interactions", otherUid, "likes", user.uid);

  const dislikeRef1 = doc(firestore, "interactions", user.uid, "dislikes", otherUid);
  const dislikeRef2 = doc(firestore, "interactions", otherUid, "dislikes", user.uid);

  await Promise.all([
    deleteDoc(likeRef1).catch(()=>{}),
    deleteDoc(likeRef2).catch(()=>{}),
    deleteDoc(dislikeRef1).catch(()=>{}),
    deleteDoc(dislikeRef2).catch(()=>{})
  ]);
};

export const loadUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(firestore, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return null;
  return snap.data();
};

export const getChatList = async () => {

  const user = auth.currentUser;
  if (!user) return [];

  const matchesRef = collection(firestore, "matches");
  const matchesSnap = await getDocs(matchesRef);

  const chatList: any[] = [];

  for (const docSnap of matchesSnap.docs) {

    const data: any = docSnap.data();

    if (!data['users'].includes(user.uid)) continue;

    const matchId = docSnap.id;

    const otherUid = data['users'].find((uid: any) => uid !== user.uid);

    // carga de perfil
    const userRef = doc(firestore, "users", otherUid);
    const userSnap = await getDoc(userRef);

    let name = "Usuario";
    let photo = "assets/iconsYimgs/default-avatar.png";

    if (userSnap.exists()) {
      const userData: any = userSnap.data();

      name = userData?.public?.name || "Usuario";
      photo = userData?.public?.photos?.[0] || photo;
    }

    // ultimo mensage
    const messagesRef = collection(firestore, "chats", matchId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

    const msgSnap = await getDocs(q);

    let lastMessage = "Empieza la conversación";
    let time = "";
    let timestamp = Date.now();

    if (!msgSnap.empty) {
      msgSnap.forEach(m => {
        const msg: any = m.data();

        lastMessage = msg.text || "";
        timestamp = msg.timestamp;

        const date = new Date(msg.timestamp);
        time =
          date.getHours() + ":" +
          date.getMinutes().toString().padStart(2, "0");
      });
    }

    chatList.push({
      id: matchId,
      name,
      photo,
      lastMessage,
      time,
      timestamp
    });

  }

  // nuevos se van primeros
  chatList.sort((a, b) => b.timestamp - a.timestamp);

  return chatList;

};

export const subscribeChatList = (callback: (chats:any[]) => void) => {

  const user = getAuth().currentUser;
  if (!user) return;

  const matchesRef = collection(firestore, "matches");

  const messageUnsubs: Record<string, () => void> = {};
  const chatList: any[] = [];

  const unsubscribeMatches = onSnapshot(matchesRef, async (snapshot) => {

    const activeMatchIds: string[] = [];

    for (const docSnap of snapshot.docs) {

      const data:any = docSnap.data();

      if (!data['users'].includes(user.uid)) continue;

      const matchId = docSnap.id;
      activeMatchIds.push(matchId);

      if (messageUnsubs[matchId]) continue;

      const otherUid = data['users'].find((uid:any)=> uid !== user.uid);

      const userRef = doc(firestore, "users", otherUid);
      const userSnap = await getDoc(userRef);

      let name = "Usuario";
      let photo = "assets/iconsYimgs/default-avatar.png";

      if (userSnap.exists()) {
        const userData:any = userSnap.data();
        name = userData?.public?.name || "Usuario";
        photo = userData?.public?.photos?.[0] || photo;
      }

      const messagesRef = collection(firestore, "chats", matchId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

      const unsubscribeMsg = onSnapshot(q, (msgSnap)=>{

        let lastMsgData: any = null;

        let lastMessage = "Empieza la conversación";
        let time = "";
        let timestamp = 0;

        if (!msgSnap.empty) {
          msgSnap.forEach(m => {

            const msg:any = {
              id: m.id,
              ...m.data()
            };

            lastMsgData = msg;
            timestamp = msg.timestamp;

            const date = new Date(timestamp);

            time =
              date.getHours() + ":" +
              date.getMinutes().toString().padStart(2,"0");

            lastMessage = msg.text;
          });
        }

        const existingIndex = chatList.findIndex(c => c.id === matchId);

        const chatData = {
          id: matchId,
          name,
          photo,
          lastMessage,
          time,
          timestamp,
          lastMessageData: lastMsgData
        };

        if (existingIndex !== -1) {
          chatList[existingIndex] = chatData;
        } else {
          chatList.push(chatData);
        }

        chatList.sort((a,b)=>b.timestamp-a.timestamp);

        callback([...chatList]);

      });

      messageUnsubs[matchId] = unsubscribeMsg;
    }

    Object.keys(messageUnsubs).forEach(matchId => {
      if (!activeMatchIds.includes(matchId)) {
        messageUnsubs[matchId]();
        delete messageUnsubs[matchId];

        const index = chatList.findIndex(c => c.id === matchId);
        if (index !== -1) chatList.splice(index, 1);
      }
    });

  });

  return () => {
    unsubscribeMatches();
    Object.values(messageUnsubs).forEach(unsub => unsub());
  };
};

export const getUserLikesCount = async () => {
  const user = getAuth().currentUser;
  if (!user) return 0;

  const likesRef = collection(firestore, "interactions", user.uid, "likes");
  const snap = await getDocs(likesRef);

  return snap.size;
};

export const getUserMessagesCount = async () => {
  const user = getAuth().currentUser;
  if (!user) return 0;

  const matches = await getUserMatches();

  let total = 0;

  for (const match of matches) {
    const messagesRef = collection(firestore, "chats", match.id, "messages");
    const snap = await getDocs(messagesRef);

    snap.forEach(doc => {
      const data: any = doc.data();
      if (data.senderUid === user.uid) {
        total++;
      }
    });
  }

  return total;
};

export const getMatchUsers = async (matchId: string) => {

  const matchRef = doc(firestore, "matches", matchId);
  const snap = await getDoc(matchRef);

  if (!snap.exists()) return null;

  return snap.data();
};

export const getMatchesByCity = async (
  city: string,
  filters: {
    lookingGender: string;
    ageMin: number;
    ageMax: number;
  }
  ) => {

  const user = getAuth().currentUser;
  if (!user) return [];

  const firestore = getFirestore();

  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("private.location", "==", city));
  const querySnapshot = await getDocs(q);

  // recibimos like
  const likesSnap = await getDocs(
    collection(firestore, "interactions", user.uid, "likes")
  );

  const dislikesSnap = await getDocs(
    collection(firestore, "interactions", user.uid, "dislikes")
  );

  const matchesSnap = await getDocs(collection(firestore, "matches"));

  const matchedUsers = new Set<string>();

  matchesSnap.forEach(doc => {
    const data: any = doc.data();

    if (data.users.includes(user.uid)) {
      const other = data.users.find((uid: string) => uid !== user.uid);
      if (other) matchedUsers.add(other);
    }
  });

  const interactedUsers = new Set<string>();

  likesSnap.forEach(doc => interactedUsers.add(doc.id));
  dislikesSnap.forEach(doc => interactedUsers.add(doc.id));

  const matches: Array<any> = [];

  querySnapshot.forEach(doc => {

    if (doc.id === user.uid) return;

    if (interactedUsers.has(doc.id)) return;

    const data = doc.data();
    const pubData = data["public"];

    if (pubData) {

      const age = pubData.age ?? 0;
      const gender = pubData.gender ?? '';

      //  FILTER 1
      if (age < filters.ageMin || age > filters.ageMax) return;

      //  FILTER 2
      if (
        filters.lookingGender !== 'todos' &&
        gender !== filters.lookingGender
      ) return;

      // FILTER 3
      if (matchedUsers.has(doc.id)) return;

      matches.push({
        uid: doc.id,
        name: data["name"] ?? "Player",
        description: pubData.description,
        age: pubData.age,
        gender: pubData.gender,
        photos: pubData.photos
      });
    }

  });

  return matches;

};
