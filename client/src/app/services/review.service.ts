import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from '../constants/contants';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  findbyUserID(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${apiurl}/review/user/${id}`);
  }

  findbyProductID(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${apiurl}/review/product/${id}`);
  }

  update(id: number, data: any) {
    return this.http.patch(`${apiurl}/review/${id}`, data);
  }

  create(data: Review) {
    return this.http.post(`${apiurl}/review`, data);
  }
}
