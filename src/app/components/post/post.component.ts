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
import { PostService } from '../../services/post.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule, MenuModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  items: MenuItem[] | undefined;
  user!: IUserData;
  
  constructor(private router: Router, private userService: UserService, private forumService: ForumService, private authService: AuthService, private postService: PostService, private toastr: ToastrService) { }

  @Input() post!: IPost;

  @Output() postDeleted = new EventEmitter<number>();

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.items = [
      {
        items: [
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.deletePost(this.post.id_post)
          }
        ]
      }
    ];
  }

  goProfile(id_user: number) {
    this.userService.setTempId(id_user);
    this.router.navigate(['/profile', id_user]);
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

  deletePost(id_post: number) {
    this.postService.deletePost(id_post).subscribe({
      next: (res: any) => {
        this.toastr.success('Post eliminado correctamente');
        this.postDeleted.emit(id_post);
        this.id_user.emit(this.user.id_user);
      },
      error: (error: any) => {
        this.toastr.error('Error al eliminar el post');
      }
    }); 
  }

  goComments(id_post: number) {
    this.userService.setTempId(id_post);
    this.router.navigate(['/comments']);
  }

  @Output() id_post = new EventEmitter<number>();
}
