import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from '../constants/contants';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  upload(img: File) {
    const fd = new FormData();
    fd.append('img', img);
    return this.http.post(`${apiurl}/upload`, fd);
  }
}
