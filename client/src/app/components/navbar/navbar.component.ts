import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  handleSearch(): void {
    const keyword = prompt('Nhập từ khóa cần tìm kiếm');

    if (keyword) {
      location.href = '/shop?p=1&keyword=' + keyword;
    }
  }

  handleUser(): void {
    const token = this.tokenService.getToken();

    this.authService.verifyToken(token).subscribe({
      next: (data: any) => {
        if (!data) {
          location.href = 'login';
        } else {
          location.href = 'profile/info';
        }
      },
    });
  }

  handleCart(): void {
    location.href = 'cart';
  }
}
