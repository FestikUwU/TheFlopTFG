import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, IonButton, IonIcon, IonImg]
})
export class HomePage implements OnInit {
  constructor(private router: Router, private navCtrl: NavController) { }


  ngOnInit() {
  }
  shout() {
    const text = 'TUS DATOS SON!!!';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.volume = 1; // максимум разрешённый
    utterance.rate = 0.9; // чуть медленнее, чтобы "кричало"
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


  onCheck() {
    console.log('Нажата галочка ✅');
    // Тут можно добавить логику "лайка" или другое действие
  }

  onCross() {
    console.log('Нажат крестик ❌');
    // Тут можно добавить логику "пасы" или другое действие
  }


}
