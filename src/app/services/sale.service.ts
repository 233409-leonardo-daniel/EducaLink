import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISalePost } from '../models/isale-post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8000/sale-post/'; // Ruta base para la API de SalePost

  constructor(private http: HttpClient, private authService: AuthService) {}


  getSalePosts(): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(this.apiUrl, this.authService.getHttpOptions());
  }

  
  createSalePost(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData, {
        headers: {
            'enctype': 'multipart/form-data',
            'Authorization': `Bearer ${this.authService.getToken()}`
        }
    });
  }

  // Obtener un SalePost por ID
  getSalePostById(id: number): Observable<ISalePost> {
    return this.http.get<ISalePost>(`${this.apiUrl}${id}/`, this.authService.getHttpOptions());
  }

  // Actualizar un SalePost existente
  updateSalePost(id: number, salePost: Partial<ISalePost>): Observable<ISalePost> {
    return this.http.put<ISalePost>(`${this.apiUrl}${id}/`, salePost, this.authService.getHttpOptions());
  }

  // Eliminar un SalePost por ID
  deleteSalePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`, this.authService.getHttpOptions());
  }
}
