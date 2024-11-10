import { Injectable } from '@angular/core';
import { IUserData } from '../models/iuser-data';
import { Observable } from 'rxjs';
import { IForum } from '../models/iforum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8000';

  private userData: IUserData = {
    name: '',
    lastname: '',
    mail: '',
    education_level: '',
    password: '',
    user_type: '',
  };

  setData(data: IUserData) {
    this.userData = data;
  }

  getData(): IUserData {
    return this.userData;
  }

  getForumSuggestions (): Observable<IForum[]> {
    return this.http.get<IForum[]>(`${this.url}/forum/education_level/${this.userData.education_level}/`);
  }


  constructor(private http: HttpClient) { }
}
