import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { subscribeChatList } from 'src/app/firebase.service';
import { AlertController } from '@ionic/angular';
import { deleteChatFromFirestore } from 'src/app/firebase.service';
import { getAuth } from "firebase/auth";
import {
  IonContent,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {NavbarComponent} from "../../components/navbar/navbar.component";

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
    IonItem,
    NavbarComponent
  ]
})
export class ChatListPage implements OnInit, OnDestroy {

  matches: any[] = [];
  loading = true;
  currentUserUid: string | undefined;

  private unsubscribeChats: any;
  private unsubscribeAuth: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const auth = getAuth();

    this.unsubscribeAuth = auth.onAuthStateChanged((user) => {

      if (!user) return;

      this.currentUserUid = user.uid;

      this.unsubscribeChats?.();

      this.unsubscribeChats = subscribeChatList((chats) => {
        this.matches = chats;
      });

      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  }

  ngOnDestroy() {
    this.unsubscribeChats?.();
    this.unsubscribeAuth?.();
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
    this.router.navigate(['/home']);
  }

  goToSlotsGame() {
    this.router.navigate(['/slot']);
  }

  goStats() {
    this.router.navigate(['/stats']);
  }

  goToChatList() {
    this.router.navigate(['/chat-list']);
  }

  goToChat(matchId: string) {
    this.router.navigate(['/chat', matchId]);
  }

  goToSettings() {
    this.router.navigate(['/profile']);
  }

  isUnread(chat: any): boolean {
    if (!chat?.lastMessageData) return false;
    if (!this.currentUserUid) return false;

    const msg = chat.lastMessageData;

    return (
      msg.senderUid !== this.currentUserUid &&
      !msg.seenBy?.includes(this.currentUserUid)
    );
  }
}
