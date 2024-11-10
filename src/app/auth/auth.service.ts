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
      { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
  };

  isLogged(): boolean {
    return this.isLoggedIn;
  }

  isAlreadyRegistered(correo: string): Observable<any> {
    return this.http.get<any>(`${this.url}/user/mail/${correo}`, this.httpOptions);
  }
  register(data: IUserData): Observable<any> {
    return this.http.post<any>(`${this.url}/user/`, data, this.httpOptions);
  }
  constructor(private http: HttpClient) { }
}
