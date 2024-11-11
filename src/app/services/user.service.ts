import { Injectable } from '@angular/core';
import { IUserData } from '../models/iuser-data';
import { IForum } from '../models/iforum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
  };

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

  getUserForums(user_id: string): Observable<IForum[]> { 
    
    return this.http.get<IForum[]>(`${this.url}/user/forums/${user_id}/`);
  }

  constructor(readonly http: HttpClient) { }
}
