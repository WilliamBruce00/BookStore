import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.login(form.value).subscribe({
      next: (data: any) => {
        if (!data.token) {
          Swal.fire({
            title: 'Thất bại',
            text: data.message,
            icon: 'error',
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) Swal.close();
          });
        } else {
          Swal.fire({
            title: 'Thành công',
            text: data.message,
            icon: 'success',
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) {
              this.tokenService.setToken(data.token);
              location.href = '';
            }
          });
        }
      },
    });
  }
}
