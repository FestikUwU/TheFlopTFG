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
  IonToggle,
  IonSegment,
  IonSegmentButton,
  AlertController
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

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
    IonToggle,
    IonSegment,
    IonSegmentButton
  ]
})
export class ProfilePage implements OnInit {

  mode: 'editar' | 'preview' = 'editar';

  // ✅ ЕДИНЫЙ ОБЪЕКТ ПРОФИЛЯ
  profile = {
    description: '',
    age: null as number | null,
    gender: '',
    photos: [] as string[]
  };

  ageOptions: Array<{ value: number; display: string }> = [];

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.generateAgeOptions();
  }

  generateAgeOptions() {
    this.ageOptions = Array.from({ length: 100 }, (_, i) => ({
      value: i,
      display: i.toString().padStart(2, '0')
    }));
  }

  onPlusClick() {
    console.log('Añadir foto');
  }

  async onListoClick() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => this.router.navigate(['/home'])
        }
      ]
    });

    await alert.present();
  }
}
