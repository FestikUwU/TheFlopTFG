import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { sendChatMessage, subscribeToChat } from 'src/app/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { getMatchUsers } from 'src/app/firebase.service';
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { IonTextarea } from "@ionic/angular/standalone";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  IonContent,
  IonButton,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons
} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

const auth = getAuth();

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule,
    IonButtons,
    IonTextarea
  ]
})
export class ChatPage implements OnInit {
  isMusicOn: boolean = false;
  otherUserName: string = "";
  otherUserPhoto: string = "";
  currentUserUid: string | undefined;

  @ViewChild('content') content!: IonContent;

  matchId: string = "test_chat";

  messages: any[] = [];
  newMessage: string = '';
  username: string = 'User' + Math.floor(Math.random() * 1000);
  private bgMusic!: HTMLAudioElement;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.bgMusic = new Audio('assets/audio/no-more-what-ifs.mp3');
    this.bgMusic.loop = true;

    this.matchId = this.route.snapshot.paramMap.get('matchId')!;

    const match: any = await getMatchUsers(this.matchId);

    if (match) {

      const currentUserUid = auth.currentUser?.uid;

      const otherUid = match['users'].find((uid: any) => uid !== currentUserUid);

      const firestore = getFirestore();
      const userRef = doc(firestore, "users", otherUid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {

        const userData: any = userSnap.data();

        this.otherUserName = userData?.public?.name || "Usuario";
        this.otherUserPhoto = userData?.public?.photos?.[0] || "assets/iconsYimgs/default-avatar.png";

      }

    }

    onAuthStateChanged(auth, (user) => {

      if (!user) return;

      this.currentUserUid = user.uid;

      subscribeToChat(this.matchId, (msgs) => {
        this.ngZone.run(() => {

          this.messages = this.groupMessagesByDate(msgs);

          this.markMessagesAsSeen(msgs);

          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        });
      });

    });

  }

  fadeInMusicSimple(targetVolume: number = 0.07) {
    if (!this.bgMusic) return;
    this.bgMusic.volume = 0;
    this.bgMusic.play().catch(() => {});

    const steps = 3;
    const stepVolume = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep < steps) {
        this.bgMusic.volume += stepVolume;
        currentStep++;
      } else {
        clearInterval(fadeInterval);
      }
    }, 200);
  }

  ionViewWillLeave() {
    if (this.bgMusic) {
      this.fadeOutMusicSimple();
    }
  }

  fadeOutMusicSimple() {
    if (!this.bgMusic) return;
    const steps = 3;
    const stepVolume = this.bgMusic.volume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep < steps) {
        this.bgMusic.volume -= stepVolume;
        currentStep++;
      } else {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, 150);
  }


  send() {
    if (this.newMessage.trim() !== '') {
      sendChatMessage(this.matchId, this.newMessage);
      this.newMessage = '';
    }
  }


  goBack() {
    this.navCtrl.navigateRoot('/chat-list', {
    });
  }

  groupMessagesByDate(messages: any[]) {
    const groups: any[] = [];

    messages.forEach(msg => {

      if (!msg.timestamp) return;

      let date: Date;

      if (msg.timestamp.seconds) {
        date = new Date(msg.timestamp.seconds * 1000);
      } else {
        date = new Date(msg.timestamp);
      }

      if (isNaN(date.getTime())) return;

      const dayKey = date.toDateString();

      let group = groups.find(g => g.key === dayKey);

      if (!group) {
        group = {
          key: dayKey,
          date: date,
          messages: []
        };
        groups.push(group);
      }

      group.messages.push(msg);
    });

    return groups;
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '';

    let date: Date;

    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) return '';

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    }

    return date.toLocaleDateString();
  }

  toggleMusic() {
    this.isMusicOn = !this.isMusicOn;

    if (this.isMusicOn) {
      this.fadeInMusicSimple();
    } else {
      this.fadeOutMusicSimple();
    }
  }

  markMessagesAsSeen(messages: any[]) {
    const userId = this.currentUserUid;
    if (!userId) return;

    const firestore = getFirestore();

    messages.forEach(async (msg) => {
      if (!msg.seenBy?.includes(userId)) {
        const ref = doc(firestore, "chats", this.matchId, "messages", msg.id);

        await updateDoc(ref, {
          seenBy: arrayUnion(userId)
        });
      }
    });
  }

  isSeen(msg: any): boolean {
    if (!msg.seenBy) return false;

    return msg.seenBy.length > 1;
  }
}