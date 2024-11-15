import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUserData } from '../../models/iuser-data';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  name: string = ''
  education_level: string = ''
  profile_image_url: string = ''

  constructor(readonly userService: UserService, readonly authService: AuthService){
    this.name = this.user.name || 'Nombre no disponible';
    this.education_level = this.user.education_level || 'Profesor de Primaria';
    this.profile_image_url = this.user.profile_image_url || 'https://via.placeholder.com/40';
  }

  ngOnInit(): void {
    // this.user = this.authService.getUser() || {} as IUserData
    
  } 
  }

