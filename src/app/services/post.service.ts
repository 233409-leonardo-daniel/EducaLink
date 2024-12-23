import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IPost } from '../models/ipost';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IForum } from '../models/iforum';
import { IUserData } from '../models/iuser-data';
import { IComment } from '../models/icomment';
import { IAd } from '../models/iad';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = 'http://98.85.11.22:8000';
  // private url = 'http://localhost:8000';
  private tempId: number = 0;
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

  setTempId(id: number) {
    this.tempId = id;
  }

  getTempId(): number {
    return this.tempId;
  }

  getCommentsByPostId(id_post: number): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.url}/comments/post/${id_post}/`, this.getHttpOptions());
  }

  getPostById(id_post: number): Observable<IPost> {
    return this.http.get<IPost>(`${this.url}/post/${id_post}/`, this.getHttpOptions());
  }

  getPostByEducationLevel(education_level: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.url}/post/education_level/${education_level}/`, this.getHttpOptions());
  }
  
  getPostByForum(list: number[]): Observable<IPost[]> {
    const requests = list.map((id) => this.http.get<IPost>(`${this.url}/posts/forum/${id}`, this.getHttpOptions()));
    return forkJoin([...requests]);
  }
  
  getForumPosts(forum_id: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.url}/posts/forum/${forum_id}`, this.getHttpOptions());
  }

  getUsersByForum(forum_id: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/forum/${forum_id}/users/`, this.getHttpOptions());
  }

  createPost(formData: FormData): Observable<IPost> {
    return this.http.post<IPost>(`${this.url}/post/`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getPostsByUser(user_id: number): Observable<IPost[]> {
    console.log(user_id);
    return this.http.get<IPost[]>(`${this.url}/post/user/${user_id}/`, this.getHttpOptions());
  }

  getPostsByUserWhereIsPrivateAndPublic(user_id: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(`${this.url}/post/user/${user_id}/private/`, this.getHttpOptions());
  }

  deletePost(id_post: number): Observable<any> {
    return this.http.delete(`${this.url}/post/${id_post}/`, this.getHttpOptions());
  }

  getPostsByForumExcludeUser(list: number[], user_id: number): Observable<IPost[]> {
    const requests = list.map((forum_id) => this.http.get<IPost>(`${this.url}/post/forum/${forum_id}/exclude/${user_id}`, this.getHttpOptions()));
    return forkJoin([...requests]);
  }
}
