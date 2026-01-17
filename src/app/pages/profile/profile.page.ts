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
  AlertController, IonTextarea
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
    IonSegmentButton,
    IonTextarea
  ]
})
export class ProfilePage implements OnInit {

  mode: 'editar' | 'ajustes' | 'preview' = 'editar';

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

  onPlusClick() {
    // Создаем скрытый input для выбора фото
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

}
