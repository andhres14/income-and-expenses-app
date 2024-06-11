import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuth().pipe(
    // Se dispara el efecto secundario
    tap( (status) => {
      if (!status) {
        router.navigate(['/login']);
      }
    })
  );
};
