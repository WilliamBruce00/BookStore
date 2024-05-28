import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private authService: AuthService) {}

  setToken(data: any): void {
    localStorage.setItem('token', data);
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  verifyToken(): void {
    this.authService.verifyToken(this.getToken()).subscribe({
      next: (data: any) => {
        if (!data) {
          this.removeToken();
          Swal.fire({
            text: 'Vui lòng đăng nhập',
            icon: 'warning',
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) location.href = '/';
          });
        }
      },
    });
  }
}
