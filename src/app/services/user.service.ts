import { Injectable } from '@angular/core';
import { IUserData } from '../models/iuser-data';
import { IForum } from '../models/iforum';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8000';
  private idTemp = 0;
  private userDataSubject = new BehaviorSubject<IUserData | null>(null);
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
  updateUser(user_id: number, userData: FormData): Observable<IUserData> {
    console.log('User data:', userData);
    return this.http.put<IUserData>(`${this.url}/user/${user_id}/`, userData, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        observe: 'body'
    });
  }

  getUserDataObservable(): Observable<IUserData | null> {
    return this.userDataSubject.asObservable();
  }

  private userData: IUserData = {} as IUserData;
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

  getUserById(id_user: number): Observable<IUserData> {
    return this.http.get<IUserData>(`${this.url}/user/${id_user}/`);
  }

  followUser(id_user: number): Observable<any> {
    return this.http.post<any>(`${this.url}/user/follow/${id_user}/`, {}, this.authService.getHttpOptions());
  }

  unFollowUser(user_id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/user/unfollow/${user_id}/`, this.authService.getHttpOptions());
  }

  getFollowers(id_user: number): Observable<IUserData[]> {
    console.log('Getting followers for user', id_user);
    return this.http.get<IUserData[]>(`${this.url}/user/followers/${id_user}/`);
  }

  getFollowing(id_user: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/user/following/${id_user}/`);
  }

  createChat(receiver_id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/chat/${receiver_id}/`, {}, this.authService.getHttpOptions());
  }
  setTempId(id: number) {
    this.idTemp = id;
  }

  getTempId() {
    return this.idTemp;
  }

  leaveForum(forum_id: number, user_id: number): Observable<any> {
    
    return this.http.delete<any>(`${this.url}/user/leave_forum/${user_id}/${forum_id}/`, this.authService.getHttpOptions());
  }
}
