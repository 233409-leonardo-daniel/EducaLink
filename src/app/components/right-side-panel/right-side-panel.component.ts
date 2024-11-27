import { Component, Input, OnInit } from '@angular/core';
import { FollowingSideComponent } from '../following-side/following-side.component';
import { GroupComponent } from '../group/group.component';
import { GroupListComponent } from '../group-list/group-list.component';
import { GroupItemComponent } from '../group-item/group-item.component';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { IForum } from '../../models/iforum';
import { CommonModule } from '@angular/common';
import { IUserData } from '../../models/iuser-data';

@Component({
  selector: 'app-right-side-panel',
  standalone: true,
  imports: [GroupItemComponent, CommonModule],
  templateUrl: './right-side-panel.component.html',
  styleUrl: './right-side-panel.component.css'
})
export class RightSidePanelComponent implements OnInit{
  @Input() forums : IForum[] = []
  @Input() user: IUserData = {} as IUserData;
  following: IUserData[] = [];

  constructor(
    private router: Router, 
    private userService: UserService, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    console.log('User en RightSidePanel:', this.user);
    this.loadFollowing();
  }

  loadFollowing() {
    this.userService.getFollowing(this.user.id_user).subscribe({
      next: (data: IUserData[]) => {
        this.following = data;
        console.log(this.following);
      },
    });
  }
  
  goGroups() { 
    this.userService.getTempId();
    if (!this.userService.getTempId()) {
      this.userService.setTempId(this.authService.getUser()?.id_user as number)
      this.router.navigate(['/user-forums']);
    }
    this.router.navigate(['/user-forums']);
  }

  goProfile(id_user: number) {
    this.userService.setTempId(id_user);
    this.router.navigate(['/profile', id_user]);
  }

  goFollowing(id_user: number) {
    localStorage.setItem('userTemp', JSON.stringify(id_user));
    this.router.navigate(['/user-following']);
  }
}
