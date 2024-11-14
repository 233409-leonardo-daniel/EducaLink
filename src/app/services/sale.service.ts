import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISalePost } from '../models/isale-post';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8000/sale-post/'; //este es un ejemplo no la ruta xd

  constructor(private http: HttpClient) {}

  getSalePosts(): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(this.apiUrl);
  }
}
