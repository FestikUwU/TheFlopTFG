import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

//  Импортируем функцию регистрации из твоего firebase.service.ts
import { registerUser } from 'src/app/firebase.service'; // путь поправь под себя
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonInput, IonItem,
    IonLabel, IonButton
  ]
})
export class RegisterPage implements OnInit {

  //  Поля, связанные с формой
  name = '';
  email = '';
  password = '';

  constructor(private router: Router, private toastController: ToastController) {}

  ngOnInit() {}

  // 🔹 Метод, который вызывается при клике кнопки "Entrar"
  async onRegister() {
    try {
      // 🔹 Вызываем регистрацию в Firebase
      await registerUser(this.name, this.email, this.password);

      // 🔹 После успешной регистрации редирект на home
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al registrarse:', error);
      // 🔹 Тут можно добавить alert для пользователя
    }
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


}
