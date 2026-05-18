import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {NavbarComponent} from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-slot',
  templateUrl: './slot.page.html',
  styleUrls: ['./slot.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    NavbarComponent
  ]
})
export class SlotPage implements OnInit {
  annoyLevel = 0;

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
    this.router.navigate(['/home']);
  }

  goStats() {
    this.router.navigate(['/stats']);
  }

  goToSlotsGame() {
    this.router.navigate(['/slot']);
  }

  goToChatList() {
    this.router.navigate(['/chat-list']);
  }

  goToSettings() {
    this.router.navigate(['/profile']);
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

    this.posX = 0;
    this.posY = 0;

    this.annoyLevel++;

    if (this.annoyLevel === 1) {
      this.message = "Ey… estoy trabajando aquí ";
    }
    else if (this.annoyLevel === 2) {
      this.message = "Oye… para ya ";
    }
    else if (this.annoyLevel === 3) {
      this.message = "¿Te parece gracioso? ";
    }
    else if (this.annoyLevel === 4) {
      this.message = "Deja de tocarme ";
    }
    else if (this.annoyLevel === 5) {
      this.message = "Última advertencia…";
    }
    else if (this.annoyLevel === 6) {
      this.message = "Voy a gritar tus datos";
    }
    else if (this.annoyLevel >= 7) {
      this.message = "VALE, TÚ LO HAS PEDIDO";
      this.shout();
      this.annoyLevel = 0;
    }

    setTimeout(() => {
      this.message = "";
    }, 2000);
  }
}

