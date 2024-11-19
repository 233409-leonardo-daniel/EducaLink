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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, GroupListComponent, CommonModule, PostComponent, RouterLink],
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

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService
  ) {}

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

  private loadUserDetails(): void {
    this.userService.getUserForums(this.user.id_user).subscribe({
      next: (data: IForum[]) => {
        this.forums = data;
        this.idForums = data.map((forum) => forum.id_forum);
      },
      error: (err) => {
        console.error('Error al obtener foros del usuario:', err);
      }
    });

    this.postService.getPostsByUser(this.user.id_user).subscribe({
      next: (data: IPost[]) => {
        this.posts = data;
      },
      error: (err) => {
        console.error('Error al obtener publicaciones del usuario:', err);
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
    this.userService.setTempId(id_user);
    this.router.navigate(['/chat']);
  }
}
