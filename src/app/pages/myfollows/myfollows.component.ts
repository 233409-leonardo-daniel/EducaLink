import { Component, OnInit} from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { IUserData } from '../../models/iuser-data';
import { IPost } from '../../models/ipost';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-myfollows',
  standalone: true,
  imports: [NavbarComponent,CommonModule,PostComponent],
  templateUrl: './myfollows.component.html',
  styleUrl: './myfollows.component.css'
})
export class MyfollowsComponent implements OnInit {
  posts: IPost[] = [];
  loading = false;
  error = '';

  constructor(private userService: UserService, private postService: PostService) {}

  ngOnInit(): void {
    this.fetchFollowedPosts();
  }

  fetchFollowedPosts(): void {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (!user?.id_user) {
      this.error = 'Usuario no autenticado.';
      this.loading = false;
      return;
    }
  
    this.userService.getFollowing(user.id_user).subscribe({
      next: (followers: IUserData[]) => {
        const postRequests = followers.map((follower) =>
          this.postService.getPostsByUser(follower.id_user)
        );
  
        forkJoin(postRequests).subscribe({
          next: (results) => {
            this.posts = results.flat();
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Error al cargar los posts.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los usuarios que sigues.';
        this.loading = false;
      },
    });
  }

}
