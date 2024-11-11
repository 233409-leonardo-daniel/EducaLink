import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserData } from '../models/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private token: string | null = null;
  private url = 'http://localhost:8000';

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.setToken(storedToken);
      this.isLoggedIn = true;
    }
  }

  isLogged(): boolean {
    return this.isLoggedIn;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  private getHttpOptions() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      })
    };
  }

  isAlreadyRegistered(correo: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/mail/${correo}`, this.getHttpOptions());
  }

  register(data: IUserData): Observable<any> {
    return this.http.post<any>(`${this.url}/user/`, data, this.getHttpOptions());
  }

  login(mail: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', mail);
    formData.append('password', password);

    return this.http.post<any>(`${this.url}/login/`, formData);
  }
}
