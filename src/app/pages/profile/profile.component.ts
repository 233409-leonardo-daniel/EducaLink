import { Component, Input } from '@angular/core';
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
import { error } from 'console';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, GroupListComponent, CommonModule, PostComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  followers = [];
  following = [];
  localuser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  user = {} as IUserData;
  idTemp = 0
  current_id= this.localuser.id_user
  isCurrentUserFollowing = false;
  
  // user : IUserData = {} as IUserData;
  
  // user : IUserData = {
  //   id_user: 1,
  //   name: 'Testname',
  //   lastname: 'lastnameTest',
  //   background_image_url: 'URL',
  //   profile_image_url:  'URL2',
  //   mail: 'mail',
  //   education_level: 'Primaria',
  //   password: '',
  //   user_type: 'User',
  //   creation_date: '13/11/2024',
  //   state: 'Activo'
  // }

  constructor(private toastr: ToastrService,private router: Router, private userService: UserService, private postService: PostService, private authService: AuthService) {
    console.log(this.current_id);
    this.idTemp = this.userService.getTempId()
    this.userService.getUserById(this.idTemp).subscribe((data: IUserData) => {
      console.log(data)
      this.user = data;
      console.log(this.user)
      this.userService.getUserForums(this.user.id_user).subscribe((data: any) => {
        this.forums = data;
        this.idForums = data.map((forum: any) => forum.id_forum);
      });
      
      this.postService.getPostsByUser(this.user.id_user).subscribe((data: any) => {
        this.posts = data;
        console.log(this.posts); 
      });
  
      this.userService.getFollowers(this.user.id_user).subscribe((data: any) => {
        this.followers = data;
        this.isCurrentUserFollowing = data.some((follower: any) => follower.id_user === this.current_id);
      });
  
      this.userService.getFollowing(this.user.id_user).subscribe((data: any) => {
        this.following = data;
      });
    });
  }

  editProfile(){
    this.router.navigate(['/editprofile']);
  }

  followUser(id_user: number): void {
    this.userService.followUser(id_user).subscribe({
      next: (data: any) => {
        this.toastr.success('Siguiendo al usuario');
      },
      error: (error: any) => {
        console.error('Error al seguir al usuario:', error);
        this.toastr.error('Error al seguir al usuario');
      }
    });
  }

  unFollowUser(id_user: number): void {
    this.userService.unFollowUser(id_user).subscribe({
      next: (data: any) => {
        this.toastr.success('Dejaste de seguir al usuario');
      },
      error: (error: any) => {
        console.error('Error al dejar de seguir al usuario:', error);
        this.toastr.error('Error al dejar de seguir al usuario');
      }
    });
  }

  contactUser(id_user: number) {
    this.userService.setTempId(id_user);
    this.router.navigate(['/chat']);
  }


}
