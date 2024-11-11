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

interface Post {
  name: string;
  description: string;
  background_image_url: string;
  image_url: string;
  education_level: string;
  privacy: string;
  creation_date: string;
  id_user: number;
}

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

  constructor(readonly authService: AuthService, readonly userService: UserService, readonly postService : PostService) {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const objetoRecuperado = JSON.parse(userItem);
      console.log(objetoRecuperado.id_user);
      this.userService.getUserForums(objetoRecuperado.id_user).subscribe((data: any) => {
        this.forums = data;
        console.log(this.forums);
        this.idForums = data.map((forum: any) => forum.id_forum);
        this.postService.getPostByForum(this.idForums).subscribe((data: IPost[]) => {          
          this.posts = data.flat();
          console.log(this.posts);
          
        })
        
      });
    } else {
      console.error("No se encontró el usuario en localStorage.");
    }
  }
}
