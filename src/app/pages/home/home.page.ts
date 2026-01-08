import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, IonButton, IonIcon]
})
export class HomePage implements OnInit {
  constructor(private router: Router) { }


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

  goToChatList() {
    this.router.navigate(['/chat-list']);
  }

  goToSlotsGame(){
    this.router.navigate(['/slot']);
  }

}
