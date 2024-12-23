import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Router } from '@angular/router';
import { IUserData } from '../../models/iuser-data';
import { UserService } from '../../services/user.service';
import { GroupListComponent } from "../../components/group-list/group-list.component";
import { IForum } from '../../models/iforum';
import { IPost } from '../../models/ipost';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PrimeIcons } from 'primeng/api';
import { PostComponent } from "../../components/post/post.component";
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { IChat } from '../../models/ichat';
import { ISalePost } from '../../models/isale-post';
import { SaleService } from '../../services/sale.service';
import { CreateSalePostComponent } from "../create-sale-post/create-sale-post.component";
import { PostventaComponent } from '../../components/postventa/postventa.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, Validators } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [NavbarComponent, GroupListComponent, CommonModule, PostComponent, RouterLink, PostventaComponent, SelectButtonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  followers: IUserData[] = [];
  following: IUserData[] = [];
  user = {} as IUserData;
  current_id: number = 0;
  isCurrentUserFollowing = false;
  salePosts: ISalePost[] = [];
  sectionSelected = 'posts';
  constSalePosts: ISalePost[] = [];
  options = [
    { label: 'Publicaciones', value: 'posts' },
    { label: 'Ventas', value: 'sales' }
  ];
  searchForm: FormGroup;
  filteredSales: ISalePost[] = [];
  originalSalePosts: ISalePost[] = [];
  stateOptions: any[] = [{ label: 'Publicaciones', value: 'posts' },{ label: 'Ventas', value: 'sales' }];
  value: string = 'off';
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private chatService: ChatService,
    private saleService: SaleService,
    private forumService: ForumService
  ) {
    this.searchForm = new FormGroup({
      selectedSale: new FormControl<string>('', Validators.required)
    });
  }

  ngOnInit() {
    // Obtener usuario actual desde el servicio AuthService
    const userData = this.authService.getUser();
    if (userData) {
      this.current_id = userData.id_user;
      this.userService.getUserById(this.userService.getTempId()).subscribe({
        next: (data: IUserData) => {
          this.user = data;
          this.loadUserDetails();
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
        }
      });
    }
  }

  filterSale(event: AutoCompleteCompleteEvent) {
    let filtered: ISalePost[] = [];
    let query = event.query;
    for (let i = 0; i < this.originalSalePosts.length; i++) {
      let sale = this.originalSalePosts[i];
      if (sale.title.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(sale);
      }
    }
    this.filteredSales = filtered;
  }

  searchSale() {
    if (this.searchForm.value.selectedSale) {
      if (typeof this.searchForm.value.selectedSale === 'object') {
        this.salePosts = [this.searchForm.value.selectedSale];
      } 
      else {
        const searchTerm = this.searchForm.value.selectedSale.toLowerCase();
        this.salePosts = this.originalSalePosts.filter(sale => 
          sale.title.toLowerCase().includes(searchTerm)
        );
      }
    } else {
      // Si no hay término de búsqueda, restaurar todos los posts
      this.salePosts = [...this.originalSalePosts];
    }
  }

  private loadUserDetails(): void {
    this.forumService.getForumsByUser(this.user.id_user).subscribe({
      next: (data: IForum[]) => {
        this.forums = data;
        this.idForums = data.map((forum) => forum.id_forum);
      },
      error: (err) => {
        console.error('Error al obtener foros del usuario:', err);
      }
    });

    this.postService.getPostsByUserWhereIsPrivateAndPublic(this.user.id_user).subscribe({
      next: (data: IPost[]) => {
        this.posts = data;
        this.posts.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
      },
      error: (err) => {
        console.error('Error al obtener publicaciones del usuario:', err);
      }
    });

    this.saleService.getSalePostsByUser(this.user.id_user).subscribe({
      next: (data: ISalePost[]) => {
        this.salePosts = data;
        this.originalSalePosts = [...data];
      },
      error: (err) => {
        console.error('Error al obtener ventas del usuario:', err);
      }
    });

    this.userService.getFollowers(this.user.id_user).subscribe({
      next: (data: IUserData[]) => {
        this.followers = data;
        this.isCurrentUserFollowing = data.some(
          (follower) => follower.id_user === this.current_id
        );
      },
      error: (err) => {
        console.error('Error al obtener los seguidores del usuario:', err);
      }
    });

    this.userService.getFollowing(this.user.id_user).subscribe({
      next: (data: IUserData[]) => {
        this.following = data;
      },
      error: (err) => {
        console.error('Error al obtener los seguidos del usuario:', err);
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/editprofile']);
  }

  followUser(id_user: number): void {
    this.userService.followUser(id_user).subscribe({
      next: () => {
        this.toastr.success('Siguiendo al usuario');
        this.isCurrentUserFollowing = true;
        this.loadUserDetails(); 
      },
      error: (err) => {
        console.error('Error al seguir al usuario:', err);
        this.toastr.error('Error al seguir al usuario');
      }
    });
  }

  unFollowUser(id_user: number): void {
    this.userService.unFollowUser(id_user).subscribe({
      next: () => {
        this.toastr.success('Dejaste de seguir al usuario');
        this.isCurrentUserFollowing = false;
        this.loadUserDetails(); 
      },
      error: (err) => {
        console.error('Error al dejar de seguir al usuario:', err);
        this.toastr.error('Error al dejar de seguir al usuario');
      }
    });
  }

  contactUser(id_user: number): void {
    this.chatService.createChat(id_user).subscribe({
      next: () => {
        
        this.userService.setTempId(id_user);
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.userService.setTempId(id_user);
          this.router.navigate(['/chat']);
        } else {
          this.toastr.error('Oops, ocurrio un error al crear el chat');
          console.error('Error al crear el chat:', err);   
        }
      }
    });
  }

  changeSection(section: string): void {
    this.sectionSelected = section;
  }

  onPostDeleted(id_post: number) {
    this.userService.setTempId(this.user.id_user);
    this.router.navigate(['/profile', this.user.id_user]);
    this.posts = this.posts.filter(post => post.id_post !== id_post);
  }

  onSaleDeleted(id_sale_post: number) {
    this.salePosts = this.salePosts.filter(post => post.id_sale_post !== id_sale_post);
  }
}
