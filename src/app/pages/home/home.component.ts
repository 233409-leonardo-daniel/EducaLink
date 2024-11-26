import { ForumService } from './../../services/forum.service';
import { IPost } from './../../models/ipost';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DialogModule } from 'primeng/dialog';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    PostInputComponent, 
    PostComponent, 
    GroupListComponent, 
    NavbarComponent, 
    FollowingSideComponent, 
    RightSidePanelComponent,
    DialogModule,
    MenuModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService]
})
export class HomeComponent implements OnInit {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
  idFollowed: number[] = [];
  showFilterModal: boolean = false;
  filterMenu: MenuItem[] = [
    {
      label: 'Recomendados para ti',
      icon: 'pi pi-star',
      command: () => this.filterByRecommended(this.user),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'De tus seguidos',
      icon: 'pi pi-user',
      command: () => this.filterByFollowed(),
      styleClass: 'text-[#3A00AE] font-bold'
    }
  ];

  @ViewChild('filterMenuRef') filterMenuRef!: Menu;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly postService: PostService,
    private readonly forumService: ForumService
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
  }

  filterByRecommended(user: IUserData): void {
    this.forumService.getForumsByUser(user.id_user).subscribe({
      next: (data: IForum[]) => {
        this.forums = data;
        console.log(this.forums);
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

  openFilterMenu(event: Event): void {
    this.filterMenuRef.toggle(event);
  }
}
