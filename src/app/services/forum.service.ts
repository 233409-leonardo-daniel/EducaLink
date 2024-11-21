import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { IForum } from '../models/iforum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { IUserData } from '../models/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private url = 'http://localhost:8000';
  private idTemp = 0;
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

  // Método para establecer un ID temporal (por ejemplo, cuando el usuario selecciona un foro)
  setTempId(id: number): void {
    this.idTemp = id;
  }

  getForumsByGradeAndEducationLevel(grade: number, education_level: string): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/grade/${grade}/education_level/${education_level}/`, this.authService.getHttpOptions());
  }

  getForumsByEducationLevel(education_level: string): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/education_level/${education_level}/`, this.authService.getHttpOptions());
  }

  getForumsByGrade(grade: number): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/grade/${grade}/`, this.authService.getHttpOptions());
  }

  // Método para obtener el ID temporal almacenado
  getTempId(): number {
    return this.idTemp;
  }

  getForumById(forum_id: number): Observable<IForum> {
    return this.http.get<IForum>(`${this.url}/forum/${forum_id}/`, this.authService.getHttpOptions());
  }

  getForumMembers(id_forum: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/forum/${id_forum}/users/`, this.authService.getHttpOptions());
  }

  createForum(forumData: IForum): Observable<IForum> {
    return this.http.post<IForum>(
      `${this.url}/forum/`,
      forumData,
      this.authService.getHttpOptions()
    );
  }

  // Editar un foro existente
  editForum(id_forum: number, forumData: IForum): Observable<IForum> {
    return this.http.put<IForum>(
      `${this.url}/forum/${id_forum}/edit/`,
      forumData,
      this.authService.getHttpOptions()
    );
  }

  // User Join Forum
  joinForum(forum_id: number): Observable<any> {
    return this.http.post<any>(
      `${this.url}/forum/${forum_id}/join/`,
      this.authService.getHttpOptions()
    );
  }

  // Eliminar un foro
  deleteForum(id_forum: number): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/forum/${id_forum}`,
      this.authService.getHttpOptions()
    );
  }
}
