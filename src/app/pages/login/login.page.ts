import { Router } from '@angular/router';
import { Component } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [
    IonContent,
    IonButton,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonItem,
    IonLabel,
    IonInput,
    FormsModule   // <-- [(ngModel)]
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email && this.password) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);

      // Переход на главную страницу
      this.router.navigate(['/home']);
    } else {
      alert('Por favor, complete todos los campos');
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
