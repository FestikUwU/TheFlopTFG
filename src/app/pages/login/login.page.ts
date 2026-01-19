import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

// Импорт функции из firebase.service.ts
import { loginUser } from 'src/app/firebase.service'; // путь подкорректируй

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  // 🔹 toast
  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  // 🔹 логин через Firebase
  async login() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, complete todos los campos');
      return;
    }

    try {
      await loginUser(this.email, this.password); // функция из firebase.service.ts
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Firebase Login Error:', error);
      this.showToast(error.message, 3000);
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
