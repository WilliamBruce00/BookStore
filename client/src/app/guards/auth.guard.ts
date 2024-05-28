import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const token = inject(TokenService);

  if (token.getToken()) {
    return true;
  } else {
    location.href = '/';
    return false;
  }
};
