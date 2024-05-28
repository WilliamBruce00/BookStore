import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiurl } from '../constants/contants';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  findbyUserID(id: string): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${apiurl}/cart/${id}`);
  }

  updateQuantity(id: number, data: any) {
    return this.http.patch(`${apiurl}/cart/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${apiurl}/cart/${id}`);
  }

  create(data: Cart) {
    return this.http.post(`${apiurl}/cart`, data);
  }
}
