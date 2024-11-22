import { Component, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IForum } from '../../models/iforum';
import { GroupItemComponent } from '../../components/group-item/group-item.component';
import { AuthService } from '../../auth/auth.service';
import { ForumService } from '../../services/forum.service';
import { IUserData } from '../../models/iuser-data';

@Component({
  selector: 'app-user-forums',
  standalone: true,
  imports: [NavbarComponent, CommonModule, GroupItemComponent],
  templateUrl: './user-forums.component.html',
  styleUrl: './user-forums.component.css'
})
export class UserForumsComponent implements OnInit {
  forums: IForum[] = []
  user: IUserData = {} as IUserData;
  
  ngOnInit() {
    this.user = this.authService.getUser() as IUserData;
    if (this.user.id_user) {
      this.forumService.getForumsByUser(this.user.id_user).subscribe((data) => {
        this.forums = data;
      });
      
    }
  }


  constructor(private forumService: ForumService, private authService: AuthService) { }
}
