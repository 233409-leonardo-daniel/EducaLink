import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { IPost } from '../models/ipost';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IForum } from '../models/iforum';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = 'http://localhost:8000';
  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
  };

  constructor(private http: HttpClient, readonly authService: AuthService) {}


  getPostByEducationLevel(education_level: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.url}/post/education_level/${education_level}/`);
  }
  
  getPostByForum(list: number[]): Observable<IPost[]> {
    let requests = list.map((id) => this.http.get<IPost>(`${this.url}/posts/forum/${id}`));
    return forkJoin([...requests]);
  }
}
