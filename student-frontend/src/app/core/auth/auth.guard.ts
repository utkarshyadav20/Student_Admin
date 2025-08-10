import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { switchMap, catchError } from 'rxjs';
import { of } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkTokenValidity().pipe(
    catchError(() => {
      router.navigate(['/login']); 
      return of(false); 
    })
  );
};

export const loginRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getTokenFromStorage();

  if (token) {
    router.navigate(['/admin/dashboard']);
    return false; 
  }

  return true;
};

