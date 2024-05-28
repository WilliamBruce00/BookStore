import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Details } from '../models/details.model';
import { apiurl } from '../constants/contants';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Details[]> {
    return this.http.get<Details[]>(`${apiurl}/details`);
  }

  findOne(id: string): Observable<Details> {
    return this.http.get<Details>(`${apiurl}/details/${id}`);
  }
}
