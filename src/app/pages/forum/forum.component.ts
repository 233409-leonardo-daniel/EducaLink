import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { PostService } from '../../services/post.service';
import { IPost } from '../../models/ipost';
import { IUserData } from '../../models/iuser-data';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [NavbarComponent, CommonModule, PostComponent, DialogModule, FormsModule, ButtonModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forum: IForum = {} as IForum;
  posts: IPost[] = [];
  members: IUserData[] = [];
  current_id: number = 0;
  isCurrentUserMember: boolean = false;
  visible: boolean = false;
  password: string = '';
  constructor(
    private router: Router,
    private forumService: ForumService,
    private postService: PostService,
    private userService: UserService,
    private toastr: ToastrService,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    const localuser = this.authService.getUser();
    if (!localuser) {
      console.error('Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.current_id = localuser.id_user;

    const forumId = this.forumService.getTempId();
    this.forumService.getForumById(forumId).subscribe({
      next: (forum: IForum) => {
        this.forum = forum;
        this.loadForumPosts();
        this.loadForumMembers();
      },
      error: (err) => {
        console.error('Error al cargar el foro:', err);
        this.toastr.error('Error al cargar el foro');
      }
    });
  }

  private loadForumPosts(): void {
    this.postService.getForumPosts(this.forum.id_forum).subscribe({
      next: (postsData: IPost[]) => {
        this.posts = postsData;
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

  private loadForumMembers(): void {
    this.forumService.getForumMembers(this.forum.id_forum).subscribe({
      next: (membersData: IUserData[]) => {
        this.members = membersData;
        this.isCurrentUserMember = this.members.some(
          (member) => member.id_user === this.current_id
        );
      },
      error: (err) => {
        console.error('Error al cargar miembros del foro:', err);
      }
    });
  }

  editForum(): void {
    localStorage.setItem('forumId', this.forum.id_forum.toString());
    this.router.navigate(['/editforum']);
  }

  joinForum(id_forum: number, password: string): void {
    if (this.isCurrentUserMember) {
      this.toastr.warning('Ya eres miembro de este foro');
      return;
    }

    this.forumService.joinForum(id_forum, password).subscribe({
      next: () => {
        this.toastr.success('Te has unido al foro exitosamente');
        this.visible = false;
        this.isCurrentUserMember = true;
        this.loadForumMembers(); 
      },
      error: (err) => {
        if (err.error.detail == 'Contraseña incorrecta') {
          this.toastr.error('Contraseña incorrecta');
        } else {
          this.toastr.error('Error al unirse al foro');
        }
        console.error('Error al unirse al foro:', err);
      }
    });
  }

  leaveForum(): void {
    if (!this.isCurrentUserMember) {
      this.toastr.warning('No eres miembro de este foro');
      return;
    }

    this.userService.leaveForum(this.forum.id_forum, this.current_id).subscribe({
      next: () => {
        this.toastr.success('Has abandonado el foro exitosamente');
        this.isCurrentUserMember = false; 
        this.loadForumMembers(); 
      },
      error: (err) => {
        console.error('Error al abandonar el foro:', err);
        if (err.error && err.error.detail) {
          const errorMessage = err.error.detail;
          if (errorMessage === 'No eres miembro de este foro') {
            this.toastr.error('No eres miembro de este foro');
          } else if (errorMessage === 'Debes permanecer a al menos 1 foro') {
            this.toastr.error('Debes permanecer a al menos 1 foro');
          } else {
            this.toastr.error('Error al abandonar el foro: ' + errorMessage);
          }
        } else {
          this.toastr.error('Error al abandonar el foro');
        }
      }
    });
  }

  expelUser(id_user: number): void {
    if (this.current_id !== this.forum.id_user) {
      this.toastr.error('No tienes permisos para expulsar usuarios');
      return;
    }

    this.userService.leaveForum(this.forum.id_forum, id_user).subscribe({
      next: () => {
        this.toastr.success('Usuario expulsado exitosamente');
        this.loadForumMembers(); 
      },
      error: (err) => {
        console.error('Error al expulsar al usuario:', err);
        this.toastr.error('Error al expulsar al usuario');
      }
    });
  }

  goProfile(id_user: number): void {
    this.userService.setTempId(id_user);
    this.router.navigate(['/profile', id_user]);
  }

  showDialog() {
    this.visible = true;
  }
}
