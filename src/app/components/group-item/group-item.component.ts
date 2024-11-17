import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent implements OnInit {
  @Input() forum = {
    name: '',
    description:  '',	
    background_image_url: '',
    image_url: '',
    education_level: '',
    privacy: '',
    password: '',
    id_forum: 0,
    creation_date: '',
    user_name:  '',
    id_user: 0,
    users_count: 0
  }

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
