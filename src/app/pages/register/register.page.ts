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
import {NavController, ToastController} from '@ionic/angular';


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

  // Флаги для отображения карт
  showCard1 = false;
  showCard2 = false;
  showCard3 = false;
  showLogo = false;

  // URL карт (будут выбраны рандомно)
  card1Url = '';
  card2Url = '';
  card3Url = '';

  // Массив всех 52 карт - ДОБАВЛЕНО РАСШИРЕНИЕ .png
  private allCards = [
    // Пики (Spades)
    'assets/iconsYimgs/Spades2.jpg', 'assets/iconsYimgs/Spades3.jpg', 'assets/iconsYimgs/Spades4.jpg',
    'assets/iconsYimgs/Spades5.jpg', 'assets/iconsYimgs/Spades6.jpg', 'assets/iconsYimgs/Spades7.jpg',
    'assets/iconsYimgs/Spades8.jpg', 'assets/iconsYimgs/Spades9.jpg', 'assets/iconsYimgs/Spades10.jpg',
    'assets/iconsYimgs/SpadesJ.jpg', 'assets/iconsYimgs/SpadesQ.jpg', 'assets/iconsYimgs/SpadesK.jpg',
    'assets/iconsYimgs/SpadesT.jpg',

    // Червы (Hearts)
    'assets/iconsYimgs/Hearts2.jpg', 'assets/iconsYimgs/Hearts3.jpg', 'assets/iconsYimgs/Hearts4.jpg',
    'assets/iconsYimgs/Hearts5.jpg', 'assets/iconsYimgs/Hearts6.jpg', 'assets/iconsYimgs/Hearts7.jpg',
    'assets/iconsYimgs/Hearts8.jpg', 'assets/iconsYimgs/Hearts9.jpg', 'assets/iconsYimgs/Hearts10.jpg',
    'assets/iconsYimgs/HeartsJ.jpg', 'assets/iconsYimgs/HeartsQ.jpg', 'assets/iconsYimgs/HeartsK.jpg',
    'assets/iconsYimgs/HeartsT.jpg',

    // Бубны (Diamonds)
    'assets/iconsYimgs/Diamonds2.jpg', 'assets/iconsYimgs/Diamonds3.jpg', 'assets/iconsYimgs/Diamonds4.jpg',
    'assets/iconsYimgs/Diamonds5.jpg', 'assets/iconsYimgs/Diamonds6.jpg', 'assets/iconsYimgs/Diamonds7.jpg',
    'assets/iconsYimgs/Diamonds8.jpg', 'assets/iconsYimgs/Diamonds9.jpg', 'assets/iconsYimgs/Diamonds10.jpg',
    'assets/iconsYimgs/DiamondsJ.jpg', 'assets/iconsYimgs/DiamondsQ.jpg', 'assets/iconsYimgs/DiamondsK.jpg',
    'assets/iconsYimgs/DiamondsT.jpg',

    // Трефы (Clubs)
    'assets/iconsYimgs/Clubs2.jpg', 'assets/iconsYimgs/Clubs3.jpg', 'assets/iconsYimgs/Clubs4.jpg',
    'assets/iconsYimgs/Clubs5.jpg', 'assets/iconsYimgs/Clubs6.jpg', 'assets/iconsYimgs/Clubs7.jpg',
    'assets/iconsYimgs/Clubs8.jpg', 'assets/iconsYimgs/Clubs9.jpg', 'assets/iconsYimgs/Clubs10.jpg',
    'assets/iconsYimgs/ClubsJ.jpg', 'assets/iconsYimgs/ClubsQ.jpg', 'assets/iconsYimgs/ClubsK.jpg',
    'assets/iconsYimgs/ClubsT.jpg'
  ];

  // Массив использованных карт (чтобы не повторялись)
  private usedCards: string[] = [];

  constructor(private router: Router, private toastController: ToastController, private navCtrl: NavController) {}

  ngOnInit() {}

  // Получить случайную карту (без повторов)
  private getRandomCard(): string {
    const availableCards = this.allCards.filter(card => !this.usedCards.includes(card));

    if (availableCards.length === 0) {
      // Если все карты использованы, сбрасываем
      this.usedCards = [];
      return this.allCards[Math.floor(Math.random() * this.allCards.length)];
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];
    this.usedCards.push(selectedCard);

    return selectedCard;
  }

  // Методы для показа карт при вводе
  onNameInput() {
    if (this.name.length > 2 && !this.showCard1) {
      this.card1Url = this.getRandomCard();
      this.showCard1 = true;
    } else if (this.name.length < 2) {
      this.showCard1 = false;
    }
  }

  onEmailInput() {
    if (this.email.length > 4 && !this.showCard2) {
      this.card2Url = this.getRandomCard();
      this.showCard2 = true;
    } else if (this.email.length < 4) {
      this.showCard2 = false;
    }
  }

  onPasswordInput() {
    if (this.password.length > 5 && !this.showCard3) {
      this.card3Url = this.getRandomCard();
      this.showCard3 = true;
    } else if (this.password.length < 5) {
      this.showCard3 = false;
    }
  }

  //  Метод, который вызывается при клике кнопки "Entrar"
  async onRegister() {
    // Показываем лого перед регистрацией
    this.showLogo = true;

    // Небольшая задержка для показа анимации
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      //  Вызываем регистрацию в Firebase
      await registerUser(this.name, this.email, this.password);

      //  После успешной регистрации редирект на home
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al registrarse:', error);
      this.showLogo = false; // Скрываем лого если ошибка
      //  Тут можно добавить alert для пользователя
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

  goToLogin() {
    this.navCtrl.navigateRoot('/login', {
      animated: false
    });
  }
}
