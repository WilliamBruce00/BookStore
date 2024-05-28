import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TokenService } from '../../services/token.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { AuthService } from '../../services/auth.service';
import { concatMap, forkJoin, map, of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NumberFormatPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart: any;
  total: number = 0;

  constructor(
    private tokenService: TokenService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.tokenService.verifyToken();

    this.getCart();
  }

  getCart(): void {
    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((tokenResponse: any) => {
          return this.cartService.findbyUserID(tokenResponse.id);
        }),
        concatMap((cartResponse: Cart[]) => {
          if (cartResponse.length === 0) {
            return of(null);
          } else {
            return forkJoin(
              cartResponse.map((item: Cart) => {
                return this.productService.findOne(item.productID);
              })
            ).pipe(
              map((productResponse: Product[]) => {
                return productResponse.map((item: Product) => {
                  const quantity = cartResponse.find(
                    (c: Cart) => c.productID === item.id
                  )?.quantity;

                  const cartID = cartResponse.find(
                    (c: Cart) => c.productID === item.id
                  )?.id;

                  return {
                    ...item,
                    quantity,
                    cartID,
                  };
                });
              })
            );
          }
        })
      )
      .subscribe({
        next: (data: any) => {
          this.cart = data;

          if (this.cart) {
            this.total = this.cart.reduce(
              (init: number, item: any) => item.price * item.quantity + init,
              0
            );
          }
        },
      });
  }

  increase(quantity: Element, cartID: number): void {
    this.tokenService.verifyToken();

    quantity.innerHTML = (+quantity.innerHTML + 1).toString();

    this.cartService
      .updateQuantity(cartID, { quantity: +quantity.innerHTML })
      .subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            this.getCart();
          } else {
            console.log(data);
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
  }

  decrease(quantity: Element, cartID: number): void {
    this.tokenService.verifyToken();

    if (quantity.innerHTML === '1') {
      return;
    }
    quantity.innerHTML = (+quantity.innerHTML - 1).toString();

    this.cartService
      .updateQuantity(cartID, { quantity: +quantity.innerHTML })
      .subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            this.getCart();
          } else {
            console.log(data);
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
  }

  removeCart(cartID: number): void {
    this.tokenService.verifyToken();

    this.cartService.delete(cartID).subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.getCart();
        } else {
          console.log(data);
        }
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  onSubmit(form: NgForm): void {
    this.tokenService.verifyToken();

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
          const order = {
            ...form.value,
            total: this.total,
            details: this.cart,
            createAt: new Date().getTime(),
            status: 'Đang xử lý',
            userID: tokenResponse.id,
          };

          return this.orderService.create(order);
        }),
        concatMap((orderResponse: any) => {
          if (orderResponse.code === 201) {
            return forkJoin(
              this.cart.map((item: any) => this.cartService.delete(item.cartID))
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Thành công',
            text: 'Đặt hàng thành công, đơn hàng của bạn đang được xử lý',
            icon: 'success',
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => isConfirmed && location.reload());
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
