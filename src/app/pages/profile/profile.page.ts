import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { uploadPhoto } from 'src/app/firebase.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonList,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  AlertController,
  IonTextarea
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { saveUserProfile, loadUserProfile } from 'src/app/firebase.service';
import {NavController} from "@ionic/angular";


@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonList,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonTextarea
  ]
})
export class ProfilePage implements OnInit {

  isTutorial = true;
  tutorialStep = 0;

  mode: 'editar' | 'preview' = 'editar';

  profile = {
    name: '',
    description: '',
    age: null as number | null,
    gender: '',
    photos: [] as string[]
  };

  privateProfile = {
    location: '',
    lookingGender: 'todos',
    ageMin: 18,
    ageMax: 99,
    interests: [] as string[]
  };


  ageOptions: Array<{ value: number; display: string }> = [];

  sections = {
    public: true,
    private: false
  };

  constructor(
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController
  ) {}

  generateAgeOptions() {
    this.ageOptions = Array.from({ length: 100 }, (_, i) => ({
      value: i,
      display: i.toString().padStart(2, '0')
    }));
  }

  toggleSection(section: 'public' | 'private') {
    this.sections[section] = !this.sections[section];
  }


  async onPlusClick() {

    if (this.profile.photos.length >= 3) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: any) => {

      const file = event.target.files[0];

      if (!file) return;

      const url = await uploadPhoto(file);

      if (url) {
        this.profile.photos.push(url);
      }

    };

    input.click();
  }

  async ngOnInit() {

    const seen = localStorage.getItem('tutorialSeen');

    if (seen === 'true') {
      this.isTutorial = false;
    } else {
      this.isTutorial = true;
    }

    this.generateAgeOptions();

    const data = await loadUserProfile();

    if (data && data['public']) {
      const pub = data['public'];

      this.profile.name = pub.name ?? '';
      this.profile.description = pub.description ?? '';
      this.profile.age = pub.age ?? null;
      this.profile.gender = pub.gender ?? '';
      this.profile.photos = pub.photos ?? [];
    }

    if (data && data['private']) {
      const priv = data['private'];

      this.privateProfile.location = priv.location ?? '';
      this.privateProfile.lookingGender = priv.lookingGender ?? 'todos';
      this.privateProfile.ageMin = priv.ageMin ?? 18;
      this.privateProfile.ageMax = priv.ageMax ?? 99;
      this.privateProfile.interests = priv.interests ?? [];
    }

  }

  async onListoClick() {
    await saveUserProfile({
      public: this.profile,
      private: this.privateProfile
    });

    const alert = await this.alertController.create({
      header: 'Guardado',
      message: 'Perfil guardado correctamente',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }


  getTutorialText() {
    switch (this.tutorialStep) {
      case 0:
        return 'Hola  Soy Floppy.';
      case 1:
        return 'Aquí configuras tu perfil.';
      case 2:
        return 'Rellena todo y encontraremos jugadores para ti';
      default:
        return '';
    }
  }

  nextStep() {
    this.tutorialStep++;

    if (this.tutorialStep > 2) {
      this.isTutorial = false;
    }
  }

  restartTutorial() {
    this.tutorialStep = 0;
    this.isTutorial = true;

    localStorage.setItem('tutorialSeen', 'false');
  }
}
