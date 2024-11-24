import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISalePost } from '../models/isale-post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://98.85.11.22:8000/sale-post/'; // Ruta base para la API de SalePost

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSalePosts(): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(this.apiUrl);
  }

  getSalePostsByUser(id_user: number): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(`${this.apiUrl}user/${id_user}/`, this.authService.getHttpOptions());
  }

  createSalePost(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData, {
        headers: {
            'Authorization': `Bearer ${this.authService.getToken()}`
        }
    });
  }

  getSalePostById(id: number): Observable<ISalePost> {
    return this.http.get<ISalePost>(`${this.apiUrl}${id}/`);
  }

  updateSalePost(id: number, salePost: Partial<ISalePost>): Observable<ISalePost> {
    return this.http.put<ISalePost>(`${this.apiUrl}${id}/`, salePost);
  }

  deleteSalePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  getSalePostsByType(saleType: string): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(`${this.apiUrl}type/${saleType}`);
  }
}
