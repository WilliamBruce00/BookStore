import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { concatMap, forkJoin, map, of } from 'rxjs';
import { DetailsService } from '../../services/details.service';
import { Details } from '../../models/details.model';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { Cart } from '../../models/cart.model';
import { WriteReviewComponent } from '../../components/write-review/write-review.component';
import { OpenWriteReviewService } from '../../services/open-write-review.service';
import { ViewReviewComponent } from '../../components/view-review/view-review.component';
import { OpenViewReviewService } from '../../services/open-view-review.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CardProductComponent } from '../../components/card-product/card-product.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NumberFormatPipe,
    FormsModule,
    ReactiveFormsModule,
    WriteReviewComponent,
    ViewReviewComponent,
    CardProductComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  product!: Product;
  related!: Product[];
  details!: Details;
  rating: number[] = [];
  totalStar: number = 0;
  totalReview: number = 0;
  isOpenWriteReview: boolean = false;
  isOpenViewReview: boolean = false;

  form: FormGroup = new FormGroup({
    quantity: new FormControl(1),
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private detailsService: DetailsService,
    private tokenService: TokenService,
    private authService: AuthService,
    private cartService: CartService,
    private openWriteReviewService: OpenWriteReviewService,
    private openViewReviewService: OpenViewReviewService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.getProduct();
    this.getReview();
    this.getRelated();
  }

  getProduct(): void {
    const id = this.route.snapshot.params['id'];

    this.productService.findOne(id).subscribe({
      next: (response: Product) => {
        this.product = response;
      },
    });
  }

  getReview(): void {
    const id = this.route.snapshot.params['id'];

    this.reviewService.findbyProductID(id).subscribe({
      next: (data: Review[]) => {
        this.rating = Array.from({ length: 5 }).map((_: any, index: number) => {
          return (
            (100 / data.length) *
              data.filter((item: Review) => item.star === 5 - index).length || 0
          );
        });

        this.totalStar =
          Number(
            (
              data.reduce((init: number, item: Review) => item.star + init, 0) /
              data.length
            ).toFixed(1)
          ) || 0;

        this.totalReview = data.length;
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  getRelated(): void {
    const id = this.route.snapshot.params['id'];

    forkJoin([this.productService.findOne(id), this.productService.findAll()])
      .pipe(
        concatMap(([productOne, productAll]: [Product, Product[]]) => {
          const data = productAll
            .filter(
              (item: Product) =>
                item.CategoryID === productOne.CategoryID &&
                item.id !== productOne.id
            )
            .reverse()
            .slice(0, 5);

          return of(data);
        })
      )
      .subscribe({
        next: (data: Product[]) => {
          this.related = data;
        },
      });
  }

  onSubmit(): void {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.tokenService.verifyToken();

    const token = this.tokenService.getToken();

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((tokenResponse: any) => {
          return this.cartService.findbyUserID(tokenResponse.id).pipe(
            map((cartResponse: Cart[]) => {
              return {
                cartResponse,
                tokenResponse,
              };
            })
          );
        }),
        concatMap(
          ({
            cartResponse,
            tokenResponse,
          }: {
            cartResponse: Cart[];
            tokenResponse: any;
          }) => {
            const check: Cart | undefined = cartResponse.find(
              (item: Cart) => item.productID === this.product.id
            );

            if (check && check.id) {
              const data = {
                quantity: this.form.value.quantity + check.quantity,
              };
              return this.cartService.updateQuantity(check.id, data);
            } else {
              const cart = {
                userID: tokenResponse.id,
                productID: this.product.id,
                quantity: this.form.value.quantity,
              };
              return this.cartService.create(cart);
            }
          }
        )
      )
      .subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            Swal.fire({
              title: 'Thành công',
              text: 'Thêm sản phẩm vào giỏ hàng thành công',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => {
              if (isConfirmed) {
                location.reload();
              }
            });
          } else {
            console.log(data);
          }
        },
      });
  }

  openWriteReview(): void {
    this.tokenService.verifyToken();

    this.openWriteReviewService.setData(true);

    this.openWriteReviewService.getData().subscribe({
      next: (data: boolean) => {
        this.isOpenWriteReview = data;
      },
    });
  }

  openViewReview(): void {
    this.openViewReviewService.setData(true);

    this.openViewReviewService.getData().subscribe({
      next: (data: boolean) => {
        this.isOpenViewReview = data;
      },
    });
  }
}
