import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { sendMessage, subscribeMessages } from 'src/app/firebase.service';
import { IonContent, IonButton, IonFooter, IonHeader, IonInput, IonItem, IonList, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Necesario para *ngFor, *ngIf

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule
  ]
})
export class ChatPage implements OnInit {

  @ViewChild('content') content!: IonContent;

  messages: any[] = [];
  newMessage: string = '';
  username: string = 'User' + Math.floor(Math.random() * 1000);

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    subscribeMessages((data: any) => {
      this.ngZone.run(() => {
        if (data) {
          this.messages = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
          setTimeout(() => {
            if(this.content) this.content.scrollToBottom(300);
          }, 50);
        } else {
          this.messages = [];
        }
      });
    });
  }

  send() {
    if (this.newMessage.trim() !== '') {
      sendMessage(this.newMessage, this.username);
      this.newMessage = '';
    }
  }
}


