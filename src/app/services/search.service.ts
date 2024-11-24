import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = 'http://98.85.11.22:8000';
  // private url = 'http://localhost:8000';
  constructor(private http: HttpClient, private authService: AuthService) { }

  searchForumsByName(name: string) {
    return this.http.get(`${this.url}/forum/search/${name}`, this.authService.getHttpOptions());
  }

  searchUsersByName(name: string) {
    return this.http.get(`${this.url}/user/search/${name}`, this.authService.getHttpOptions());
  }

  searchPostsByTitle(title: string) {
    return this.http.get(`${this.url}/post/search/${title}`, this.authService.getHttpOptions());
  }
}
