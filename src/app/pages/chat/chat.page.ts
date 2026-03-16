import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { sendChatMessage, subscribeToChat } from 'src/app/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { getMatchUsers } from 'src/app/firebase.service';
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { IonTextarea } from "@ionic/angular/standalone";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  IonContent,
  IonButton,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons, IonImg
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
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule,
    IonButtons,
    IonImg,
    IonTextarea
  ]
})
export class ChatPage implements OnInit {
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
          this.messages = msgs;

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

    const steps = 3;                  // три шага
    const stepVolume = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep < steps) {
        this.bgMusic.volume += stepVolume;
        currentStep++;
      } else {
        clearInterval(fadeInterval);
      }
    }, 200); // каждый шаг через 200 мс
  }

  ionViewWillLeave() {
    if (this.bgMusic) {
      // плавное затухание при выходе
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
      //animated: true,
      //animationDirection: 'back'
    });
  }


}

