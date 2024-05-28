import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { apiurl } from '../constants/contants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${apiurl}/product`);
  }

  findOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${apiurl}/product/${id}`);
  }

  create(data: any) {
    return this.http.post(`${apiurl}/product`, data);
  }

  update(id: number, data: any) {
    return this.http.patch(`${apiurl}/product/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${apiurl}/product/${id}`);
  }
}
