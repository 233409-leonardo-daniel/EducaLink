import { Component, OnInit } from '@angular/core';
import { IUserData } from '../../models/iuser-data';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-following',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './user-following.component.html',
  styleUrl: './user-following.component.css'
})
export class UserFollowingComponent implements OnInit {
  user!: IUserData;
  following: IUserData[] = [];

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const userTempId = JSON.parse(localStorage.getItem('userTemp') || '{}') as number;
    this.userService.getFollowing(userTempId).subscribe((data) => {
      this.following = data;
    });
  }

  goProfile(id_user: number) {
    this.userService.setTempId(id_user);
    this.router.navigate(['/profile', id_user]);
  }
}
