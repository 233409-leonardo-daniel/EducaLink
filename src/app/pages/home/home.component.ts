import { IPost } from './../../models/ipost';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostInputComponent } from '../../components/post-input/post-input.component';
import { PostComponent } from '../../components/post/post.component';
import { GroupListComponent } from '../../components/group-list/group-list.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { log } from 'console';
import { IForum } from '../../models/iforum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostInputComponent, PostComponent, GroupListComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService]
})
export class HomeComponent {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  constructor(readonly authService: AuthService, readonly userService: UserService, readonly router: Router  , readonly postService : PostService) {
      this.userService.getUserForums(this.user.id_user).subscribe((data: any) => {
        this.forums = data;
        console.log(this.forums);
        this.idForums = data.map((forum: any) => forum.id_forum);
        this.postService.getPostByForum(this.idForums).subscribe((data: IPost[]) => {          
          this.posts = data.flat();
          console.log(this.posts);
          
        })
        
      });
  }

  goPost() {
    this.router.navigate(['/createpost']);
  }
  
}
