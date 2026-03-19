import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getUserMatches } from 'src/app/firebase.service';
import { getChatList } from 'src/app/firebase.service';
import { subscribeChatList } from 'src/app/firebase.service';
import { AlertController } from '@ionic/angular';
import { deleteChatFromFirestore } from 'src/app/firebase.service';
import { getAuth } from "firebase/auth";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonItem
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {animate} from "@angular/animations";


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem
  ]
})
export class ChatListPage implements OnInit {
  matches: any[] = [];

  constructor(private router: Router, private navCtrl: NavController, private alertController: AlertController) {}

  loading = true;

  currentUserUid: string | undefined;

  async ngOnInit() {
    //this.matches = await getUserMatches();
    //this.matches = await getChatList();
    const user = getAuth().currentUser;
    this.currentUserUid = user?.uid;

    subscribeChatList((chats)=>{
      this.matches = chats;
      this.loading = false;
    });
    //this.matches.sort((a, b) => b.timestamp - a.timestamp);
    setTimeout(() => {
      this.loading = false;
    }, 250);
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

  async deleteChat(id: string) {

    const alert = await this.alertController.create({
      header: 'Eliminar chat',
      message: 'Esta conversasion se eliminara permanente.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {

            await deleteChatFromFirestore(id);

            this.matches = this.matches.filter(chat => chat.id !== id);

          }
        }
      ]
    });

    await alert.present();
  }

  goHome() {
    this.navCtrl.navigateRoot('/home', {
      animated: false
    });
  }

  goToSlotsGame() {
    this.navCtrl.navigateRoot('/slot', {
      animated: false
    });
  }

  goStats() {
    this.navCtrl.navigateRoot('/stats', {
      animated: false
    });
  }

  goToChatList() {
    this.navCtrl.navigateRoot('/chat-list', {
      animated: false
    });
  }

  goToChat(matchId: string) {
    this.router.navigate(['/chat', matchId]);
  }


  goToSettings() {
    setTimeout(() => {
      this.navCtrl.navigateRoot('/profile', {
        animated: false
      });
    }, 100);
  }

  isUnread(chat: any): boolean {
    if (!chat.lastMessageData) return false;

    return (
      chat.lastMessageData.senderUid !== this.currentUserUid &&
      !chat.lastMessageData.seenBy?.includes(this.currentUserUid)
    );
  }

}
