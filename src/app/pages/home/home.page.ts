import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveUserProfile } from 'src/app/firebase.service';
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
import { likeUser, dislikeUser } from 'src/app/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  swipeDirection: string = '';
  isAnimating: boolean = false;

  isTutorial: boolean | null = null;
  tutorialStep = 0;

  matches: Array<any> = [];
  currentIndex = 0;
  currentMatch: any = null;

  currentUser: any = null;

  isMatch = false;
  matchedUser: any = null;

  constructor(private router: Router, private navCtrl: NavController ) {}

  isLoading = true;

  async ngOnInit() {

    const data = await loadUserProfile();

    this.isTutorial = !(data?.['tutorials']?.['homeSeen'] ?? false);

    this.isLoading = true;

    const userData = await loadUserProfile();

    this.currentUser = userData;

    const city = userData?.['private']?.location ?? '';

    if (city) {
      this.matches = await getMatchesByCity(city, {
        lookingGender: userData?.['private']?.lookingGender ?? 'todos',
        ageMin: userData?.['private']?.ageMin ?? 18,
        ageMax: userData?.['private']?.ageMax ?? 99
      });
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

  async onCheck() {
    if (this.isAnimating) return;

    this.swipeDirection = 'revolver-right';
    this.isAnimating = true;

    setTimeout(async () => {
      if (this.currentMatch) {
        const isMatch = await likeUser(this.currentMatch.uid);

        if (isMatch) {
          this.matchedUser = this.currentMatch;
          this.isMatch = true;
        }
      }

      this.nextCard();
    }, 350);
  }

  async onCross() {
    if (this.isAnimating) return;

    this.swipeDirection = 'revolver-left';
    this.isAnimating = true;

    setTimeout(async () => {
      if (this.currentMatch) {
        await dislikeUser(this.currentMatch.uid);
      }

      this.nextCard();
    }, 350);
  }

  nextCard() {
    this.currentIndex++;
    this.showNextMatch();

    this.swipeDirection = '';
    this.isAnimating = false;
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

  async reloadMatches() {

    this.isLoading = true;

    const userData = await loadUserProfile();
    const city = userData?.['private']?.location ?? '';

    if (city) {
      this.matches = await getMatchesByCity(city, {
        lookingGender: userData?.['private']?.lookingGender ?? 'todos',
        ageMin: userData?.['private']?.ageMin ?? 18,
        ageMax: userData?.['private']?.ageMax ?? 99
      });

      this.matches = this.matches.sort(() => Math.random() - 0.5);

      this.currentIndex = 0;
      this.showNextMatch();
    }

    this.isLoading = false;
  }

  goHome() {
    this.navCtrl.navigateRoot('/home', { animated: false });
  }

  goStats() {
    this.navCtrl.navigateRoot('/stats', {
      animated: false
    });
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

  closeMatch() {
    this.isMatch = false;
  }

  goToChatFromMatch() {
    this.isMatch = false;

    this.navCtrl.navigateRoot('/chat-list', {
      animated: false
    });
  }

  triggerTestMatch() {
    this.matchedUser = {
      name: 'Test User',
      photos: ['https://i.pravatar.cc/300']
    };

    this.isMatch = true;
  }

  logoClicks = 0;
  logoTimer: any;

  onLogoClick() {
    this.logoClicks++;

    clearTimeout(this.logoTimer);

    this.logoTimer = setTimeout(() => {
      this.logoClicks = 0;
    }, 1000);

    if (this.logoClicks >= 5) {
      this.triggerTestMatch();
      this.logoClicks = 0;
    }
  }

  getTutorialText() {
    switch (this.tutorialStep) {
      case 0:
        return 'Muy bien, ya has completado tu perfil. Ahora te explico todo.';
      case 1:
        return 'Aquí puedes ver perfiles.';
      case 2:
        return 'Pulsa ALL IN si te interesa.';
      case 3:
        return 'Pulsa PASS para saltar.';
      default:
        return '';
    }
  }

  async nextStep() {
    this.tutorialStep++;

    if (this.tutorialStep > 3) {
      this.isTutorial = false;

      await saveUserProfile({
        tutorials: {
          homeSeen: true
        }
      });
    }
  }

  restartTutorial() {
    this.tutorialStep = 0;
    this.isTutorial = true;

    localStorage.removeItem('tutorial_home_seen');
  }
}
