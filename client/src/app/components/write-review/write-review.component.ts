import { Review } from './../../models/review.model';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { OpenWriteReviewService } from '../../services/open-write-review.service';
import { FormsModule, NgForm } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { concatMap, map, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-write-review',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './write-review.component.html',
  styleUrl: './write-review.component.scss',
})
export class WriteReviewComponent implements OnInit {
  @ViewChildren('star') star!: QueryList<ElementRef>;

  st: string = '';

  constructor(
    private openWriteReviewService: OpenWriteReviewService,
    private tokenService: TokenService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  closeWriteReview(): void {
    this.openWriteReviewService.setData(false);
  }

  handleStarOption(star: number): void {
    this.st = star.toString();

    this.star.forEach((item, index) => {
      if (index < star) {
        item.nativeElement.classList.add('text-yellow-400');
      } else {
        item.nativeElement.classList.remove('text-yellow-400');
      }
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

    const { content, star } = form.value;

    this.authService
      .verifyToken(token)
      .pipe(
        concatMap((tokenResponse: any) => {
          return this.reviewService.findbyUserID(tokenResponse.id).pipe(
            map((reviewResponse: Review[]) => {
              return {
                reviewResponse,
                tokenResponse,
              };
            })
          );
        }),
        concatMap(({ reviewResponse, tokenResponse }: any) => {
          const check = reviewResponse.find(
            (item: Review) =>
              item.userID === tokenResponse.id &&
              item.productID === +this.route.snapshot.params['id']
          );

          if (!check) {
            const data = {
              userID: tokenResponse.id,
              productID: +this.route.snapshot.params['id'],
              content,
              createAt: new Date().getTime(),
              star,
            };

            return this.reviewService.create(data);
          } else {
            const data = {
              content,
              star,
              createAt: new Date().getTime(),
            };

            return this.reviewService.update(check.id, data);
          }
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            Swal.fire({
              title: 'Thành công',
              text: 'Cảm ơn bạn đã đánh giá sản phẩm',
              icon: 'success',
              allowOutsideClick: false,
            }).then(({ isConfirmed }) => isConfirmed && location.reload());
          } else {
            console.log(data);
          }
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
