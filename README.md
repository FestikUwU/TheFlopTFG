#  The Flop
theflopapp.vercel.app/

A mobile dating-style application with a casino theme, built using Ionic, Angular, and Firebase.

---

##  Description

**The Flop** is a mobile application where users can discover matches and interact through a real-time chat system.

The app is inspired by casino mechanics, featuring elements like cards, **ALL IN / PASS**, and a stylized UI that creates a playful and immersive experience.

---

##  Features

* 🔐 Authentication (Login & Register) with Firebase Auth
* 👤 User profile creation & editing
* 🎴 Match system (LIKE / DISLIKE)
* 💬 Real-time chat between matched users
* ✔ Message status:
  * ✔ Sent
  * ✔✔ Seen
* 🔔 Unread message indicator
* 🗑 Chat deletion
* 🎵 Optional background music in chat
* 📊 User statistics

---

## Core Logic

* Match system based on **mutual likes**
* Message grouping by date *(Today / Yesterday / custom date)*
* Seen system using `seenBy` array
* Dynamic chat sorting by last message
* Unread message detection

---

##  Stack

* **Frontend:** Ionic + Angular
* **Backend:** Firebase
  * Authentication
  * Firestore
  * Storage
* **Language:** TypeScript
* **Styling:** SCSS

---

##  Project Structure

```
pages/
 ├── login
 ├── register
 ├── home (matches)
 ├── profile
 ├── chat-list
 ├── chat
 ├── stats
 └── slot
```

---

##  Installation

```bash
git clone <your-repo-url>
cd the-flop
npm install
ionic serve
```

---

##  Build APK

```bash
ionic build
npx cap sync android
npx cap open android
```

---

##  Notes

* Developed as a **Final Degree Project (TFG)**
* Not optimized for production
* Some features are still in development

---

##  Author

**Heorhii Tykhonov**
2026

---

##  License

© 2026 Heorhii — Final Degree Project
Unauthorized academic use is prohibited.
