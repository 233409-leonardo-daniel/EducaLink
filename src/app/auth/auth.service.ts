import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IUserData } from '../models/iuser-data';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private token: string | null = null;
  // private url = 'http://98.85.11.22:8000';
  private url = 'http://localhost:8000';
  private user: IUserData | null = null;
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*',
      'Authorization': this.getToken() ? `Bearer ${this.getToken()}` : '',
    })
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.setToken(storedToken);
        this.isLoggedIn = true;
      }
    }
  }

  getOptions() {
    return this.options;
  }

  isLogged(): boolean {
    return this.isLoggedIn;
  }

  setToken(token: string) {
    this.token = token;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.token || localStorage.getItem('token');
    }
    return this.token;
  }

  getHttpOptions() {
    const headersConfig: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        headersConfig['Authorization'] = `Bearer ${token}`;
      }
    }

    return {
      headers: new HttpHeaders(headersConfig),
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

    return this.http.post<any>(`${this.url}/token`, formData);
  }

  setUser(user: IUserData) {
    this.user = user;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): IUserData | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return this.user;
  } 

  logout(): Observable<boolean> {
    this.isLoggedIn = false;
    this.token = null;
    this.user = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return of(true);
  }
}
