import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { User } from '../../../models/user.model';
import { concatMap, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements OnInit {
  error: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.tokenService.verifyToken();

    Object.entries(form.value).map(([key, value]: any) => {
      if (!value) {
        this.error[key] = 'Đây là thông tin bắt buộc';
      } else if (key === 'new_password' && value.length < 5) {
        this.error[key] = 'Mật khẩu phải từ 5 ký tự trở lên';
      } else if (
        key === 'confirm_password' &&
        value !== form.value.new_password
      ) {
        this.error[key] = 'Mật khẩu không trùng khớp';
      } else {
        delete this.error[key];
      }
    });

    if (!Object.keys(this.error).length) {
      Swal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = this.tokenService.getToken();

      this.authService
        .verifyToken(token)
        .pipe(
          concatMap((tokenResponse: any) => {
            if (!tokenResponse) {
              return of(null);
            } else {
              return this.userService.findOne(tokenResponse.id);
            }
          }),
          concatMap((findResponse: any) => {
            const data = {
              oldpassword: form.value.old_password,
              newpassword: form.value.new_password,
            };
            return this.userService.changePassword(findResponse.id, data);
          })
        )
        .subscribe({
          next: (data: any) => {
            if (!data.check) {
              Swal.fire({
                title: 'Thất bại',
                text: 'Mật khẩu cũ không chính xác',
                icon: 'error',
                allowOutsideClick: false,
              }).then(({ isConfirmed }) => {
                if (isConfirmed) Swal.close();
              });
            } else {
              Swal.fire({
                title: 'Thành công',
                text: 'Đổi mật khẩu thành công',
                icon: 'success',
                allowOutsideClick: false,
              }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                  location.reload();
                }
              });
            }
          },
        });
    }
  }
}
