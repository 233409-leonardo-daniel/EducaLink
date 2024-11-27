import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IForum } from '../../models/iforum';
import { CommonModule } from '@angular/common';
import { IUserData } from '../../models/iuser-data';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent implements OnInit {
  @Input() forum : IForum = {} as IForum;
  @Input() creatorForum : IUserData = {} as IUserData;

  isCurrentUserProfile = false;


  goForum() {
    this.forumService.setTempId(this.forum.id_forum);
    this.router.navigate(['/forum']);
  } 

  ngOnInit() {
    let id_user = this.authService.getUser()?.id_user;
    if (id_user) {
      this.isCurrentUserProfile = id_user == this.userService.getTempId();
    }
  }

  constructor(private router: Router, private forumService : ForumService, private userService: UserService, private authService: AuthService) { }
}
