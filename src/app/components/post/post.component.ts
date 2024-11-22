import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IPost } from '../../models/ipost';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ForumService } from '../../services/forum.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';



@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink, MenuModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  items: MenuItem[] = [];
  user!: IUserData;
  constructor(private router: Router, private userService: UserService, private forumService: ForumService, private menu: MenuModule, private authService: AuthService){ }
  @Input() post!: IPost;

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.items = [
      { label: 'Eliminar', icon: 'pi pi-trash', command: () => this.deletePost() }
    ];
  }

  goProfile(id_user: number) {
    // console.log(id_user);
    // console.log(this.userService.getData().id_user);
    
    this.userService.setTempId(id_user);
    if (id_user == this.user.id_user) {
      this.router.navigate(['/profile', id_user])
    } else {
      console.log('oops, este es otro perfil');
      
      this.router.navigate(['/profile', id_user]);
    }
  }

  goForum(id_forum: number) {
    this.forumService.setTempId(id_forum);  
    this.router.navigate(['/forum']);
  }

  isImage(fileUrl: string): boolean {
    return fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.gif');
  }
  @Output() id_user = new EventEmitter<number>();

  showOptions() {
    console.log('showOptions');
  }

  menuToggle(event: any) {
    console.log('menuToggle', event);
  }

  deletePost() {
    console.log('deletePost');
  }
}
