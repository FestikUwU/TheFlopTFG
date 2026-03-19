#  The Flop

A mobile dating-style application with a casino theme, developed using Ionic + Angular and Firebase.

##  Description

The Flop is a mobile app where users can discover matches and communicate through a real-time chat system.
The app follows a casino-inspired concept, using elements like cards, ALL IN / PASS actions, and a stylized visual design.

##  Main Features

* 🔐 User authentication (login & register) using Firebase Auth
* 👤 User profile creation and editing
* 🎴 Match system (LIKE / DISLIKE)
* 💬 Real-time chat between matched users
* ✔️ Message status:

* ✔ sent
* ✔✔ seen
* 🔔 Unread message indicator
* 🗑 Chat deletion
* 🎵 Optional background music in chat
* 📊 (In progress) user statistics
* 🎮 (In progress) slot-style mini game

## 🧠 Implemented Logic

* Match system based on mutual likes
* Message grouping by date (Today / Yesterday / custom date)
* "Seen" system using `seenBy` array
* Dynamic chat ordering by last message
* Detection of unread messages

## 🛠 Technologies Used

* Ionic + Angular
* Firebase:

  * Authentication
  * Firestore
  * Storage
* TypeScript
* SCSS

##  Main Structure

pages/
├── login
├── register
├── home (matches)
├── profile
├── chat-list
├── chat
├── stats
├── slot

## ⚙️ Installation

1. Clone the repository
   git clone <repo>

2. Install dependencies
   npm install

3. Run the project
   ionic serve

## Build APK

ionic build
npx cap sync android
npx cap open android

## Notes

* Developed as a Final Degree Project (TFG)
* Not optimized for production
* Some features are still in development

## Author

Heorhii Tykhonov
2026

© 2026 Heorhii - TFG
