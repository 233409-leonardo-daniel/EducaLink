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
  // private url = 'http://localhost:8000';
  private url = 'http://98.85.11.22:8000';
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

  getForums(): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/`, this.authService.getHttpOptions());
  }

  // Obtenemos todos los foros disponibles para el usuario
  getAvailableForums(user_id: number): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/user/${user_id}/not_in/`, this.authService.getHttpOptions());
  }

  // Obtenemos todos los foros disponibles para el usuario con filtro de grado y nivel de educación <- AVAILABLE quiere decir que el usuario no está en el foro
  getAvailableForumsWithDoubleFilters(user_id: number, grade: number, education_level: string): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/user/${user_id}/not_in/${grade}/${education_level}/`, this.authService.getHttpOptions());
  }

  // Obtenemos todos los foros disponibles para el usuario con filtro de nivel de educación <- AVAILABLE quiere decir que el usuario no está en el foro
  getAvailableForumsWithEducationLevelFilter(user_id: number, education_level: string): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/user/${user_id}/not_in/${education_level}/`, this.authService.getHttpOptions());
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

  getForumsByUser(user_id: number): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/user/${user_id}/`, this.authService.getHttpOptions());
  }

  getForumById(forum_id: number): Observable<IForum> {
    return this.http.get<IForum>(`${this.url}/forum/${forum_id}/`, this.authService.getHttpOptions());
  }

  getForumMembers(id_forum: number): Observable<IUserData[]> {
    return this.http.get<IUserData[]>(`${this.url}/forum/${id_forum}/users/`, this.authService.getHttpOptions());
  }

  createForum(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/forum/`, formData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  // Editar un foro existente
  editForum(id_forum: number, forumData: FormData): Observable<IForum> {
    return this.http.put<IForum>(`${this.url}/forum/${id_forum}`, forumData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }

  // User Join Forum
  joinForum(forum_id: number, password?: string): Observable<any> {
    const params = password ? { params: { password } } : {};
    return this.http.post<any>(`${this.url}/forum/${forum_id}/join/`, null, { ...this.authService.getHttpOptions(), ...params });
  }

  // Salir o expulsar un usuario del foro
  leaveForum(forum_id: number, user_id: number): Observable<any> {
    const params = { params: { user_id } };
    return this.http.delete<any>(`${this.url}/forum/${forum_id}/leave/`, { ...this.authService.getHttpOptions(), ...params });
  }

  // Eliminar un foro
  deleteForum(id_forum: number): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/forum/${id_forum}`,
      this.authService.getHttpOptions()
    );
  }
}
