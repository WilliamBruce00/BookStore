import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from '../constants/contants';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { ChangePassword } from '../models/changepassword.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(data: User) {
    return this.http.post(`${apiurl}/user`, data);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`${apiurl}/user`);
  }

  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${apiurl}/user/${id}`);
  }

  changePassword(id: string, data: ChangePassword) {
    return this.http.patch(`${apiurl}/user/changePassword/${id}`, data);
  }
}
