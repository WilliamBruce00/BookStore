import { Component, OnInit } from '@angular/core';
import { CardOrderComponent } from '../../../components/card-order/card-order.component';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import { TokenService } from '../../../services/token.service';
import { AuthService } from '../../../services/auth.service';
import { concatMap, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CardOrderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  order!: Order[];

  constructor(
    private orderService: OrderService,
    private tokenService: TokenService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(): void {
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
          return this.orderService.findbyUserID(tokenResponse.id);
        })
      )
      .subscribe({
        next: (data: Order[]) => {
          this.order = data;
          console.log(this.order);

          Swal.close();
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
