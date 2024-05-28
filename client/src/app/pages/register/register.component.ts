import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { concatMap, of } from 'rxjs';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  word: string = '1234567890qwertyuiopasdfghjklzxcvbnm';

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
  });

  constructor(
    private userService: UserService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const user = {
      email: this.form.value.email,
      password: this.randomPassword(),
    };

    this.userService
      .findAll()
      .pipe(
        concatMap((allUser: User[]) => {
          const check: User | undefined = allUser.find(
            (item: User) => item.email === user.email
          );

          if (check) {
            Swal.fire({
              title: 'Email đã tồn tại trong hệ thống',
              icon: 'warning',
            });

            return of({
              message: 'Email đã tồn tại trong hệ thống',
            });
          } else {
            return this.userService.create(user);
          }
        }),
        concatMap((createUser: any) => {
          if (createUser.response) {
            return this.userService.findOne(createUser.response.insertId);
          } else {
            return of(createUser);
          }
        }),
        concatMap((findUser: User) => {
          const email = {
            to: findUser.email,
            html: `
              <h2>Xin chào, cảm ơn bạn đã đăng ký tài khoản</h2>
              <p>Đây là thông tin tài khoản của bạn</p>
              <p>Email: ${findUser.email}</p>
              <p>Mật khẩu: ${user.password}</p>
            `,
          };

          return this.emailService.sendMail(email);
        })
      )
      .subscribe({
        next: (data: any) => {
          Swal.fire({
            title: 'Thành công',
            text: 'Đăng ký tài khoản thành công, vui lòng kiểm tra email của bạn',
            icon: 'success',
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) {
              location.href = 'login';
            }
          });
        },
        error: (err: any) => {
          throw err;
        },
      });
  }

  randomPassword(): string {
    let result: string = '';

    Array.from({ length: 10 }).map((_: any, index: number) => {
      const random = Math.floor(Math.random() * this.word.length);
      result += this.word[random];
    });

    return result;
  }
}
