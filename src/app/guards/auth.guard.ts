import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = async () => {

  const router = inject(Router);
  const auth = getAuth();

  if (auth.currentUser) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
