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
import { AdService } from '../../services/ad.service';
import { IAd } from '../../models/iad';
import { AdComponent } from '../../components/ad/ad.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    PostInputComponent, 
    PostComponent, 
    
    NavbarComponent, 
    
    RightSidePanelComponent,
    DialogModule,
    MenuModule
  , AdComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService]
})
export class HomeComponent implements OnInit {
  posts: IPost[] = [];
  ads: IAd[] = [];
  shuffledAds: IAd[] = [];
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

  Math = Math;
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
      this.loadAds();
      setTimeout(() => {
        console.log('Estado actual:');
        console.log('Anuncios:', this.ads);
        console.log('Primer anuncio:', this.ads[0]);
        console.log('Posts:', this.posts.length);
      }, 2000);
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

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = 
      [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  loadAds() {
    this.adService.getAds().subscribe({
      next: (data: IAd[]) => {
        console.log('Anuncios recibidos:', data);
        if (data && data.length > 0) {
          this.ads = data;
          this.shuffledAds = this.shuffleArray([...data]);
          console.log('Anuncios mezclados:', this.shuffledAds);
        }
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

  openFilterMenu(event: Event): void {
    this.filterMenuRef.toggle(event);
  }
}
