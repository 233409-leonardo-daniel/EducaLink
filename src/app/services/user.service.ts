import { Injectable } from '@angular/core';
import { IUserData } from '../models/iuser-data';
import { IForum } from '../models/iforum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8000';
  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
  };
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private userData: IUserData = {
    id_user: 0,
    name: '',
    lastname: '',
    background_image_url: '',
    profile_image_url: '',
    mail: '',
    education_level: '',
    password: '',
    user_type: '',
    state: '',
    creation_date: ''
  };

  setData(data: IUserData) {
    this.userData = data;
  }

  getData(): IUserData {
    return this.userData;
  }

  getUserForums(user_id: number): Observable<IForum[]> { 
    
    return this.http.get<IForum[]>(`${this.url}/user/forums/${user_id}/`);
  }

  getForumSuggestions(): Observable<IForum[]> {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const educationLevel = user.education_level || '';

      if (!educationLevel) {
        console.error('Education level is empty');
        return of([]); // Maneja el caso adecuadamente
      }

      const encodedEducationLevel = encodeURIComponent(educationLevel);
      const url = `${this.url}/forum/education_level/${encodedEducationLevel}/`;
      console.log('Requesting URL:', url);
      return this.http.get<IForum[]>(url, this.authService.getHttpOptions());
    } else {
      // Estamos en el servidor, no hacemos la solicitud
      console.warn('Not running in the browser, skipping getForumSuggestions');
      return of([]); // O manejar según tus necesidades
    }
  }

  joinForum(forum_id: number): Observable<any> {
    return this.http.post<any>(
      `${this.url}/user/join_forum/${forum_id}/`,
      {},  // Cuerpo vacío si no se envían datos
      this.authService.getHttpOptions()
    );
  }

  getUserById(id_user: number): Observable<IUserData> {
    return this.http.get<IUserData>(`${this.url}/user/${id_user}/`);
  }

  followUser(user_id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/user/follow/${user_id}/`, {}, this.authService.getHttpOptions());
  }

  unfollowUser(user_id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/user/unfollow/${user_id}/`, {}, this.authService.getHttpOptions());
  }

  getFollowers(user_id: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/user/followers/${user_id}/`);
  }

  getFollowing(user_id: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/user/following/${user_id}/`);
  }
}
