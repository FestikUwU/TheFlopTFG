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
  IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonList
  ]
})
export class ProfilePage implements OnInit {

  selectedAge: number | null = null;
  ageOptions: Array<{ value: number, display: string }> = [];

  constructor() { }

  ngOnInit() {
    this.generateAgeOptions();
  }

  generateAgeOptions() {
    this.ageOptions = Array.from({ length: 100 }, (_, i) => ({
      value: i,
      display: i.toString().padStart(2, '0')
    }));
  }

  getAgeLabel(age: number): string {
    if (age === null) return '';
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'Años';
    switch (lastDigit) {
      case 1: return 'Año';
      case 2:
      case 3:
      case 4: return 'Años';
      default: return 'años';
    }
  }
}
