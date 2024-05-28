import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login.model';
import { apiurl } from '../constants/contants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: Login) {
    return this.http.post(`${apiurl}/auth/login`, data);
  }

  verifyToken(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${apiurl}/auth/verifyToken`, { headers });
  }
}
