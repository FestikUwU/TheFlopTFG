import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent} from '@ionic/angular/standalone';
import { getUserMatches, getUserLikesCount, getUserMessagesCount } from 'src/app/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class StatsPage implements OnInit {

  matchesCount = 0;
  likesCount = 0;
  messagesCount = 0;

  isLoading = true;

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }

  async ngOnInit() {

    this.isLoading = true;

    const matches = await getUserMatches();
    this.matchesCount = matches.length;

    this.likesCount = await getUserLikesCount();
    this.messagesCount = await getUserMessagesCount();

    this.isLoading = false;
  }
}
