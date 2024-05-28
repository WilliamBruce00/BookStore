import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = async (route, state) => {
  const token = inject(TokenService);
  const auth = inject(AuthService);

  const check: any = await auth.verifyToken(token.getToken()).toPromise();

  if (!check) {
    return true;
  }

  if (token.getToken()) {
    location.href = '';
    return false;
  } else {
    return true;
  }
};
