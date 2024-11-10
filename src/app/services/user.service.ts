import { Injectable } from '@angular/core';
import { IUserData } from '../models/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: IUserData = {
    name: '',
    lastname: '',
    mail: '',
    education_level: '',
    password: '',
    user_type: '',
    state: ''
  };

  setData(data: IUserData) {
    this.userData = data;
  }

  getData(): IUserData {
    return this.userData;
  }

  constructor() { }
}
