import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from '../constants/contants';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendMail(data: Email) {
    return this.http.post(`${apiurl}/email`, data);
  }
}
