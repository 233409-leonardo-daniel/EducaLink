import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserData } from '../../models/iuser-data';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.css'
})
export class PostInputComponent implements OnInit{
  user = {} as IUserData;

  constructor(readonly router: Router, private authService : AuthService, private userService: UserService) {}

  ngOnInit() {
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;
      this.userService.getUserById(this.user.id_user).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
        }})
    }
  }

  goPost() {
    this.router.navigate(['/createpost']);
  }
}
