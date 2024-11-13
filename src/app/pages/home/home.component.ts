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

  constructor(readonly authService: AuthService, readonly userService: UserService, readonly router: Router  , readonly postService : PostService) {
      this.userService.getUserForums(this.userService.getData().id_user).subscribe((data: any) => {
        this.forums = data;
        console.log(this.forums);
        this.idForums = data.map((forum: any) => forum.id_forum);
        this.postService.getPostByForum(this.idForums).subscribe((data: IPost[]) => {          
          this.posts = data.flat();
          console.log(this.posts);
          
        })
        
      });

       // Agregar un post estático de prueba
       this.posts.push({
        content: 'Este es un post de prueba para verificar la visualización.',
        forum_id: 1,
        id_post: 101,
        user_id: 1,
        comment_count: 5,
        user_name: 'Juan Vicente',
        user_education_level: 'Profesor de matemáticas',
        user_profile_image_url: 'assets/profile.png',  // Ruta a una imagen de perfil
        publication_date: new Date().toISOString() // Fecha de publicación actual
      });
  }

  goPost() {
    this.router.navigate(['/createpost']);
  }
  
}
