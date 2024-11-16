import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISalePost } from '../models/isale-post';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8000/sale-post/'; // Ruta base para la API de SalePost

  constructor(private http: HttpClient) {}


  getSalePosts(): Observable<ISalePost[]> {
    return this.http.get<ISalePost[]>(this.apiUrl);
  }

  
  createSalePost(salePost: ISalePost): Observable<ISalePost> {
    return this.http.post<ISalePost>(this.apiUrl, salePost);
  }

  // Obtener un SalePost por ID
  getSalePostById(id: number): Observable<ISalePost> {
    return this.http.get<ISalePost>(`${this.apiUrl}${id}/`);
  }

  // Actualizar un SalePost existente
  updateSalePost(id: number, salePost: Partial<ISalePost>): Observable<ISalePost> {
    return this.http.put<ISalePost>(`${this.apiUrl}${id}/`, salePost);
  }

  // Eliminar un SalePost por ID
  deleteSalePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
