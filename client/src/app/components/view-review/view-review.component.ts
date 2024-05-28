import { Component, OnInit } from '@angular/core';
import { OpenViewReviewService } from '../../services/open-view-review.service';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { concatMap, forkJoin, map, of } from 'rxjs';
import { Review } from '../../models/review.model';
import { User } from '../../models/user.model';
import { DateFormantPipe } from '../../pipes/date-formant.pipe';

@Component({
  selector: 'app-view-review',
  standalone: true,
  imports: [DateFormantPipe],
  templateUrl: './view-review.component.html',
  styleUrl: './view-review.component.scss',
})
export class ViewReviewComponent implements OnInit {
  reviews: any;

  constructor(
    private openViewReviewService: OpenViewReviewService,
    private reviewService: ReviewService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getReview();
  }

  closeViewReview(): void {
    this.openViewReviewService.setData(false);
  }

  getReview(): void {
    const id = this.route.snapshot.params['id'];

    this.reviewService
      .findbyProductID(id)
      .pipe(
        concatMap((reviewResponse: Review[]) => {
          if (reviewResponse.length === 0) {
            return of(null);
          }
          return forkJoin(
            reviewResponse.map((item: Review) => {
              return this.userService.findOne(item.userID);
            })
          ).pipe(
            map((userResponse: User[]) => {
              return userResponse
                .map((item: User) => {
                  const { content, createAt, star, productID }: any =
                    reviewResponse.find((r: Review) => r.userID === item.id);

                  return {
                    ...item,
                    email: Array.from({ length: item.email.indexOf('@') })
                      .map((_: any, index: number) => item.email[index])
                      .join(''),
                    content,
                    createAt,
                    star,
                    productID,
                  };
                })
                .sort((a: any, b: any) => b.createAt - a.createAt);
            })
          );
        })
      )
      .subscribe({
        next: (data: any) => {
          this.reviews = data;

          console.log(this.reviews);
        },
      });
  }
}
