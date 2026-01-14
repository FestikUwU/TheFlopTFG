import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-slot',
  templateUrl: './slot.page.html',
  styleUrls: ['./slot.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon
  ]
})
export class SlotPage implements OnInit {   // ✅ ВАЖНО

  constructor(private router: Router, private navCtrl: NavController) {}

  ngOnInit() {}

  shout() {
    const text = 'TUS DATOS SON!!!';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 1.2;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  goHome() {
    this.navCtrl.navigateRoot('/home', {
      animated: false
    });
  }

  goToSlotsGame() {
    this.navCtrl.navigateRoot('/slot', {
      animated: false
    });
  }

  goToChatList() {
    this.navCtrl.navigateRoot('/chat-list', {
      animated: false
    });
  }

  goToSettings() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/profile', {
        animated: false
      });
    }, 100);
  }
}

