import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

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

