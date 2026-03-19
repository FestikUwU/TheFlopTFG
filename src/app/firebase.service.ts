import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs, addDoc, orderBy, onSnapshot, limit, deleteDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Tu configuración de Firebase
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
      createdAt: Date.now()
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

  // удалить сообщения
  const messagesRef = collection(firestore, "chats", matchId, "messages");

  const snapshot = await getDocs(messagesRef);

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  // удалить match
  const matchRef = doc(firestore, "matches", matchId);

  await deleteDoc(matchRef);

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

    // 👤 загрузка профиля
    const userRef = doc(firestore, "users", otherUid);
    const userSnap = await getDoc(userRef);

    let name = "Usuario";
    let photo = "assets/iconsYimgs/default-avatar.png";

    if (userSnap.exists()) {
      const userData: any = userSnap.data();

      name = userData?.public?.name || "Usuario";
      photo = userData?.public?.photos?.[0] || photo;
    }

    // 💬 последнее сообщение
    const messagesRef = collection(firestore, "chats", matchId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

    const msgSnap = await getDocs(q);

    let lastMessage = "Empieza la conversación 👀";
    let time = "";
    let timestamp = Date.now(); // важно чтобы не улетал вниз

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

  // 🔥 сортировка (новые сверху)
  chatList.sort((a, b) => b.timestamp - a.timestamp);

  return chatList;

};

export const subscribeChatList = (callback: (chats:any[]) => void) => {

  const user = getAuth().currentUser;
  if (!user) return;

  const matchesRef = collection(firestore, "matches");

  onSnapshot(matchesRef, async (snapshot) => {

    const chatList:any[] = [];

    for (const docSnap of snapshot.docs) {

      const data:any = docSnap.data();

      if (!data['users'].includes(user.uid)) continue;

      const matchId = docSnap.id;

      const otherUid = data['users'].find((uid:any)=> uid !== user.uid);

      // профиль пользователя
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

      const unsubscribe = onSnapshot(q, (msgSnap)=>{

        let lastMsgData: any = null; // 🔥 ВОТ ЭТОГО НЕ ХВАТАЕТ

        let lastMessage = "Empieza la conversación";
        let time = "";
        let timestamp = Date.now();

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

    }

  });

};

export const getMatchUsers = async (matchId: string) => {

  const matchRef = doc(firestore, "matches", matchId);
  const snap = await getDoc(matchRef);

  if (!snap.exists()) return null;

  return snap.data();
};

export const getMatchesByCity = async (city: string) => {

  const user = getAuth().currentUser;
  if (!user) return [];

  const firestore = getFirestore();

  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("private.location", "==", city));
  const querySnapshot = await getDocs(q);

  // получаем лайки
  const likesSnap = await getDocs(
    collection(firestore, "interactions", user.uid, "likes")
  );

  const dislikesSnap = await getDocs(
    collection(firestore, "interactions", user.uid, "dislikes")
  );

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
