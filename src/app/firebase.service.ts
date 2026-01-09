import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

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
const database = getDatabase(app);

// Función para enviar un mensaje
export const sendMessage = (message: string, username: string) => {
  const messagesRef = ref(database, 'messages');
  push(messagesRef, {
    text: message,
    user: username,
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
