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
import { NavController } from "@ionic/angular";
import { getMatchesByCity, loadUserProfile } from 'src/app/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, IonButton, IonIcon, IonImg]
})
export class HomePage implements OnInit {

  matches: Array<any> = [];       // все найденные матчи
  currentIndex = 0;               // индекс текущего отображаемого матча
  currentMatch: any = null;       // текущий матч

  constructor(private router: Router, private navCtrl: NavController) {}

  isLoading = true;

  async ngOnInit() {
    this.isLoading = true;
    const userData = await loadUserProfile();
    const city = userData?.['private']?.location ?? '';

    if (city) {
      this.matches = await getMatchesByCity(city);
      this.showNextMatch();
      console.log('Matches:', this.matches);
    }
    this.isLoading = false;
  }


  showNextMatch() {
    if (this.currentIndex < this.matches.length) {
      this.currentMatch = this.matches[this.currentIndex];
    } else {
      this.currentMatch = null; // больше матчей нет
    }
  }

  onCheck() {
    console.log('Лайк ✅', this.currentMatch);
    // Здесь можно добавить логику сохранения лайка в базу
    this.currentIndex++;
    this.showNextMatch();
  }

  onCross() {
    console.log('Пас ❌', this.currentMatch);
    this.currentIndex++;
    this.showNextMatch();
  }

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
    this.navCtrl.navigateRoot('/home', { animated: false });
  }

  goToSlotsGame() {
    this.navCtrl.navigateRoot('/slot', { animated: false });
  }

  goToChatList() {
    this.navCtrl.navigateRoot('/chat-list', { animated: false });
  }

  goToSettings() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/profile', { animated: false });
    }, 100);
  }
}
