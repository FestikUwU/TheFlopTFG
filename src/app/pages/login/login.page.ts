import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonInput,
  IonLabel
} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';


import { loginUser } from 'src/app/firebase.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonLabel,
    IonInput,
    FormsModule,
    CommonModule
  ]
})
export class LoginPage {
  isCheckingAuth = false;
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.isCheckingAuth = true;

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      this.isCheckingAuth = false;

      if (user) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }

  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }
  
  async login() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, complete todos los campos');
      return;
    }

    try {
      await loginUser(this.email, this.password); // функция из firebase.service.ts
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      console.error('Firebase Login Error:', error);
      this.showToast(error.message, 3000);
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
