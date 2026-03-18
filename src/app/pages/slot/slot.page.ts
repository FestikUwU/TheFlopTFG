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
export class SlotPage implements OnInit {   //  ВАЖНО

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

  goStats() {
    this.navCtrl.navigateRoot('/stats', {
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

  isDragging = false;
  offsetX = 0;
  offsetY = 0;

  posX = 0;
  posY = 0;

  message = "";

  startDrag(event: TouchEvent) {
    this.isDragging = true;

    const touch = event.touches[0];

    this.offsetX = touch.clientX - this.posX;
    this.offsetY = touch.clientY - this.posY;
  }

  onDrag(event: TouchEvent) {
    if (!this.isDragging) return;

    const touch = event.touches[0];

    this.posX = touch.clientX - this.offsetX;
    this.posY = touch.clientY - this.offsetY;
  }

  endDrag() {
    this.isDragging = false;

    // возвращаем назад
    this.posX = 0;
    this.posY = 0;

    this.message = "Ey… estoy trabajando aquí 😤";

    setTimeout(() => {
      this.message = "";
    }, 2000);
  }
}

