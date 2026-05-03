import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { uploadPhoto } from 'src/app/firebase.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { addIcons } from 'ionicons';
import { star, close, create } from 'ionicons/icons';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  AlertController,
  IonTextarea
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
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
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonTextarea
  ]
})
export class ProfilePage implements OnInit {


  isTutorial: boolean | null = null;
  tutorialStep = 0;
  currentPhotoIndex = 0;

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
    private navCtrl: NavController
  ) {
    addIcons({ star, close, create });
  }

  generateAgeOptions() {
    this.ageOptions = Array.from({ length: 82 }, (_, i) => {
      const age = i + 18; // desde 18
      return {
        value: age,
        display: age.toString()
      };
    });
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

    const data = await loadUserProfile();

    this.isTutorial = !(data?.['tutorials']?.['homeSeen'] ?? false);

    this.generateAgeOptions();

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

  async nextStep() {
    this.tutorialStep++;

    if (this.tutorialStep > 2) {
      this.isTutorial = false;

      await saveUserProfile({
        tutorials: {
          profileSeen: true
        }
      });
    }
  }

  restartTutorial() {
    this.tutorialStep = 0;
    this.isTutorial = true;
  }

  async logout() {
    const auth = getAuth();

    await signOut(auth);

    this.navCtrl.navigateRoot('/login');
  }

  setMainPhoto(index: number) {
    const selected = this.profile.photos[index];
    this.profile.photos.splice(index, 1);
    this.profile.photos.unshift(selected);
  }

  removePhoto(index: number) {
    this.profile.photos.splice(index, 1);
  }

  async replacePhoto(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const url = await uploadPhoto(file);

      if (url) {
        this.profile.photos[index] = url;
      }
    };

    input.click();
  }

  onSlideChange(event: any) {
    this.currentPhotoIndex = event.detail[0].activeIndex;
  }
}
