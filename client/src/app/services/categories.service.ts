import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from '../constants/contants';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${apiurl}/category`);
  }

  create(data: any) {
    return this.http.post(`${apiurl}/category`, data);
  }

  findOne(id: number): Observable<Category> {
    return this.http.get<Category>(`${apiurl}/category/${id}`);
  }

  update(id: number, data: any) {
    return this.http.patch(`${apiurl}/category/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${apiurl}/category/${id}`);
  }
}
