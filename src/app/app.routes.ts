import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    //canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    //canActivate: [authGuard]
  },
  {
    path: 'swipe',
    loadComponent: () =>
      import('./pages/swipe/swipe.page').then((m) => m.SwipePage),
    //canActivate: [authGuard]
  },
  {
    path: 'chat-list',
    loadComponent: () =>
      import('./pages/chat-list/chat-list.page').then((m) => m.ChatListPage),
    //canActivate: [authGuard]
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.page').then((m) => m.ChatPage),
    //canActivate: [authGuard]
  },
  {
    path: 'slot',
    loadComponent: () =>
      import('./pages/slot/slot.page').then((m) => m.SlotPage),
    //canActivate: [authGuard]
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./pages/stats/stats.page').then( m => m.StatsPage),
    //canActivate: [authGuard]
  },
  {
    path: 'chat/:matchId',
    loadComponent: () =>
      import('./pages/chat/chat.page').then(m => m.ChatPage),
    //canActivate: [authGuard]
  },
];
