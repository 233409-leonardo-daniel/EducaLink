import { Component } from '@angular/core';
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, GroupListComponent, CommonModule, PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}')
  current_id= this.user.id_user
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

  constructor(private router: Router, private userService: UserService, private postService: PostService){
    // this.user = this.userService.getData();

    // this.userService.getUserById(this.user.id_user).subscribe((data: IUserData) => {
    //   console.log(data)
    //   this.user = data;
    // });
    console.log(this.user)
    
    this.userService.getUserForums(this.user.id_user).subscribe((data: any) => {
      this.forums = data;
      this.idForums = data.map((forum: any) => forum.id_forum);
    });

    console.log(this.user.id_user);
    
    this.postService.getPostsByUser(this.user.id_user).subscribe((data: any) => {
      this.posts = data;
      console.log(this.posts);
    });
  }

  editProfile(){
    this.router.navigate(['/editprofile']);
  }

  followUser(id_user : number) {
    this.userService.followUser(id_user).subscribe((data: any) => {
      console.log(data);
    });
  }

  contactUser(id_user: number) {
    // Falta implementar la logica para mandar el id del usuario al chat
    this.router.navigate(['/chat']);
  }


}
