import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUserData } from '../models/iuser-data';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private token: string | null = null;
  private url = 'http://localhost:8000';
  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.token}`
      })
  };

  isLogged(): boolean {
    return this.isLoggedIn;
  }

  setToken(token: string) {
    this.token = token;
    this.httpOptions.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getToken(): string | null {
    return this.token;
  }

  isAlreadyRegistered(correo: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/mail/${correo}`, this.httpOptions);
  }
  register(data: IUserData): Observable<any> {
    return this.http.post<any>(`${this.url}/user/`, data, this.httpOptions);
  }

  login(mail: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', mail);
    formData.append('password', password);
    
    return this.http.post<any>(`${this.url}/login/`, formData);
}
  constructor(private http: HttpClient) { }
}
