import { AuthService } from '../../auth/auth.service';
import { IUserData } from './../../models/iuser-data';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-following-side',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './following-side.component.html',
  styleUrl: './following-side.component.css'
})
export class FollowingSideComponent implements OnInit {
  user: IUserData = {} as IUserData;
  following: IUserData[] = [];
  constructor(
    private  authService: AuthService,
    private  userService: UserService
  ) {} 

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.loadFollowing();
  }

  loadFollowing() {
    if (this.userService.getTempId()) {
      this.userService.getFollowing(this.userService.getTempId()).subscribe({
        next: (data: IUserData[]) => {
          this.following = data;
          console.log(this.following);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.userService.getFollowing(this.user.id_user).subscribe({
        next: (data: IUserData[]) => {
          this.following = data;
          console.log(this.following);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
