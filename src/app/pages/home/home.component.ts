import { ForumService } from './../../services/forum.service';
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
import { IUserData } from '../../models/iuser-data';
import { FollowingSideComponent } from '../../components/following-side/following-side.component';
import { RightSidePanelComponent } from "../../components/right-side-panel/right-side-panel.component";
import { AdService } from '../../services/ad.service';
import { IAd } from '../../models/iad';
import { AdComponent } from '../../components/ad/ad.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostInputComponent, PostComponent, NavbarComponent, RightSidePanelComponent, AdComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService]
})
export class HomeComponent implements OnInit {
  posts: IPost[] = [];
  ads: IAd[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
  idFollowed: number[] = [];
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly postService: PostService,
    private readonly forumService: ForumService,
    private adService: AdService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;
      this.filterByRecommended(userData);
    } else {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']); 
    }
    this.loadAds();
    
    setTimeout(() => {
      console.log('Número de posts:', this.posts.length);
      console.log('Número de ads:', this.ads.length);
      console.log('Contenido de ads:', this.ads);
    }, 2000);
  }

  filterByRecommended(user: IUserData): void {
    this.forumService.getForumsByUser(user.id_user).subscribe({
      next: (data: IForum[]) => {
        this.forums = data;
        this.idForums = data.map((forum: IForum) => forum.id_forum);
        console.log(this.idForums);
        this.postService.getPostsByForumExcludeUser(this.idForums, user.id_user).subscribe({
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
  }

  loadAds() {
    this.adService.getAds().subscribe({
      next: (data: IAd[]) => {
        console.log(data);
        this.ads = data;
      },
      error: (err) => {
        console.error('Error al obtener anuncios:', err);
      }
    });
  }



  filterByFollowed(): void {
    this.userService.getFollowing(this.user.id_user).subscribe({
      next: (data: IUserData[]) => {
        console.log(data);
        this.idFollowed = data.map((user: IUserData) => user.id_user);
        for (const id of this.idFollowed) {
          this.postService.getPostsByUserWhereIsPrivateAndPublic(id).subscribe({
            next: (data: IPost[]) => {
              this.posts = data;
            },
            error: (err) => {
            console.error('Error al obtener publicaciones:', err);
            }
          });
        }
      }
    });
  }

  goPost(): void {
    this.router.navigate(['/createpost']);
  }

  onPostDeleted(id_post: number) {
    this.posts = this.posts.filter(post => post.id_post !== id_post);
  }
}
