import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TokenService } from '../../services/token.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.tokenService.verifyToken();
  }

  logout(): void {
    Swal.fire({
      title: 'Bạn có chắc chắn đăng xuất không?',
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: 'Hủy',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.tokenService.removeToken();
        location.href = '';
      }
    });
  }
}
