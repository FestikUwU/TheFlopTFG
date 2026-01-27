import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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


@Component({
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

  mode: 'editar' | 'preview' = 'editar';

  profile = {
    description: '',
    age: null as number | null,
    gender: '',
    photos: [] as string[]
  };

  ageOptions: Array<{ value: number; display: string }> = [];

  sections = {
    public: true,
    private: false
  };

  constructor(
    private alertController: AlertController,
    private router: Router
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


  onPlusClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profile.photos.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  async ngOnInit() {
    this.generateAgeOptions();

    const data = await loadUserProfile();

    if (data && data['public']) {
      const pub = data['public'];

      this.profile.description = pub.description ?? '';
      this.profile.age = pub.age ?? null;
      this.profile.gender = pub.gender ?? '';
      this.profile.photos = pub.photos ?? [];
    }
  }

  async onListoClick() {
    await saveUserProfile(this.profile);

    const alert = await this.alertController.create({
      header: 'Guardado',
      message: 'Perfil guardado correctamente',
      buttons: [
        {
          text: 'OK',
          handler: () => this.router.navigate(['/home'])
        }
      ]
    });

    await alert.present();
  }

}
