import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const auth = getAuth();

  return new Promise((resolve) => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (user) {
        resolve(true);
      } else {
        resolve(router.createUrlTree(['/login']));
      }
    });

  });
};
