import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { sendMessage, subscribeMessages } from 'src/app/firebase.service';
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
    IonImg
  ]
})
export class ChatPage implements OnInit {

  @ViewChild('content') content!: IonContent;

  messages: any[] = [];
  newMessage: string = '';
  username: string = 'User' + Math.floor(Math.random() * 1000);
  private bgMusic!: HTMLAudioElement;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Инициализация фоновой музыки
    this.bgMusic = new Audio('assets/audio/no-more-what-ifs.mp3');
    this.bgMusic.loop = true;

    // запускаем плавный fadeIn
    this.fadeInMusicSimple(0.07); // targetVolume = 0.07

    // Слушаем сообщения
    subscribeMessages((data: any) => {
      this.ngZone.run(() => {
        if (data) {
          this.messages = Object.values(data)
            .sort((a: any, b: any) => a.timestamp - b.timestamp);
          setTimeout(() => {
            if(this.content) this.content.scrollToBottom(300);
          }, 50);
        } else {
          this.messages = [];
        }
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
      sendMessage(this.newMessage, this.username);
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

