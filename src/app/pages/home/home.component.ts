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
export class HomeComponent implements OnInit {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user: any = {};

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly postService: PostService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;

      this.userService.getUserForums(this.user.id_user).subscribe({
        next: (data: IForum[]) => {
          this.forums = data;
          this.idForums = data.map((forum: IForum) => forum.id_forum);

          this.postService.getPostByForum(this.idForums).subscribe({
            next: (data: IPost[]) => {
              this.posts = data.flat(); 
              console.log(this.posts);
            },
            error: (err) => {
              console.error('Error al obtener publicaciones:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error al obtener foros del usuario:', err);
        }
      });
    } else {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']); 
    }
  }

  goPost(): void {
    this.router.navigate(['/createpost']);
  }
}
