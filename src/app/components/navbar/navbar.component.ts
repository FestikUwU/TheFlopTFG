import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('btnHome') homeBtn!: ElementRef;
  @ViewChild('btnChats') chatsBtn!: ElementRef;
  //@ViewChild('btnStats') statsBtn!: ElementRef;
  @ViewChild('btnGame') gameBtn!: ElementRef;

  fingerX = 0;
  fingerReady = false;

  constructor(public router: Router, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateFinger();
      this.fingerReady = true;
      this.cdr.detectChanges();
    }, 50);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.fingerReady = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.updateFinger();
          this.fingerReady = true;
          this.cdr.detectChanges();
        }, 50);
      });
  }

  get active(): string {
    if (this.router.url.includes('chat-list')) return 'chats';
    if (this.router.url.includes('stats')) return 'stats';
    if (this.router.url.includes('slot')) return 'game';
    return 'home';
  }

  navigate(path: string) {
    setTimeout(() => {
      this.router.navigate([path]);
    }, 250);
  }

  updateFinger() {
    let el: ElementRef;

    switch (this.active) {
      case 'chats': el = this.chatsBtn; break;
      //case 'stats': el = this.statsBtn; break;
      case 'game': el = this.gameBtn; break;
      default: el = this.homeBtn;
    }

    if (!el?.nativeElement) return;

    const btnRect = el.nativeElement.getBoundingClientRect();
    const parentRect = el.nativeElement.closest('.bar-container').getBoundingClientRect();

    this.fingerX = (btnRect.left - parentRect.left) + (btnRect.width / 2) - 17;

    console.log('active:', this.active, 'fingerX:', this.fingerX);
  }
}
