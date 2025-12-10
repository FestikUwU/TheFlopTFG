import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'swipe',
    loadComponent: () =>
      import('./pages/swipe/swipe.page').then((m) => m.SwipePage),
  },
  {
    path: 'chat-list',
    loadComponent: () =>
      import('./pages/chat-list/chat-list.page').then((m) => m.ChatListPage),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
  },
  {
    path: 'slot',
    loadComponent: () =>
      import('./pages/slot/slot.page').then((m) => m.SlotPage),
  },
];
