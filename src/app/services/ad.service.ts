import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IAd } from '../models/iad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private url = 'http://98.85.11.22:8000';
  // private url = 'http://localhost:8000';

  getAds(): Observable<IAd[]> {
    return this.http.get<IAd[]>(`${this.url}/ads/`, this.getHttpOptions());
  }

  createAd(formData: FormData): Observable<IAd> {
    return this.http.post<IAd>(`${this.url}/ads/`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  } 

  deleteAd(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/ads/${id}`, this.getHttpOptions());
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    };
  }
}
