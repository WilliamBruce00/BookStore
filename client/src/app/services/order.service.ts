import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { apiurl } from '../constants/contants';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  create(data: Order): Observable<any> {
    return this.http.post<any>(`${apiurl}/order`, data);
  }

  findAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiurl}/order`);
  }

  findbyUserID(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiurl}/order/${id}`);
  }

  updateStatus(id: number, data: any) {
    return this.http.patch(`${apiurl}/order/${id}`, data);
  }
}
