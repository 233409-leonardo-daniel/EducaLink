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

  constructor(private http: HttpClient, readonly authService: AuthService) {}

  // Método para obtener los encabezados dinámicamente
  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getPostByEducationLevel(education_level: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.url}/post/education_level/${education_level}/`, this.getHttpOptions());
  }
  
  getPostByForum(list: number[]): Observable<IPost[]> {
    const requests = list.map((id) => this.http.get<IPost>(`${this.url}/posts/forum/${id}`, this.getHttpOptions()));
    return forkJoin([...requests]);
  }

  createPost(title: string, content: string, forum_id: number): Observable<IPost> {
    console.log(title, content, forum_id);
    return this.http.post<IPost>(`${this.url}/post/`, { title, content, forum_id }, this.getHttpOptions());
  }

  getPostsByUser(user_id: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.url}/user/posts/${user_id}/`, this.getHttpOptions());
  }
}
