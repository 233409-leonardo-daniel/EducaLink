import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { PostService } from '../../services/post.service';
import { IPost } from '../../models/ipost';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PostComponent } from '../../components/post/post.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IUserData } from '../../models/iuser-data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [NavbarComponent, PostComponent, CommonModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent {
  forum: IForum = {} as IForum;
  posts: IPost[] = [];
  members: any[] = [];
  localuser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  current_id = this.localuser.id_user;
  showMembers: boolean = false;
  isCurrentUserMember: boolean = false;

  constructor(
    private router: Router,
    private forumService: ForumService,
    private postService: PostService,
    private userService : UserService,
    private toastr: ToastrService
  ) {
    const forumId = this.forumService.getTempId();
    this.forumService.getForumById(forumId).subscribe((data: IForum) => {
      this.forum = data;
      this.postService.getForumPosts(this.forum.id_forum).subscribe((postsData: IPost[]) => {
        this.posts = postsData;
      });
      this.forumService.getForumMembers(this.forum.id_forum).subscribe((membersData: IUserData[]) => {
        console.log(membersData);
        this.members = membersData;
        this.isCurrentUserMember = membersData.some(member => member.id_user === this.current_id);
      });
    });
  }

  editForum() {
    this.router.navigate(['/editforum']);
  }

  joinForum(id_forum: number) {
    // Verificar si el usuario ya es miembro
    const isMember = this.members.some(member => member.id_user === this.current_id);
    if (isMember) {
      this.toastr.warning('Ya eres miembro de este foro');
      return;
    }

    this.userService.joinForum(id_forum).subscribe({
      next: (data: any) => {
        this.toastr.success('Te has unido al foro exitosamente');
        // Actualizar la lista de miembros
        this.forumService.getForumMembers(this.forum.id_forum).subscribe((membersData: IUserData[]) => {
          this.members = membersData;
        });
      },
      error: (error: any) => {
        console.error('Error al unirse al foro:', error);
        this.toastr.error('Error al unirse al foro');
      }
    });
  }

  expelUser(id_user: number) {
    // Verificar si el usuario actual es el creador del foro
    if (this.current_id !== this.forum.id_user) {
      this.toastr.error('No tienes permisos para expulsar usuarios');
      return;
    }

    // No permitir expulsar al creador del foro
    if (id_user === this.forum.id_user) {
      this.toastr.error('No puedes expulsar al creador del foro');
      return;
    }

    this.userService.leaveForum(this.forum.id_forum, id_user).subscribe({
      next: (data: any) => {
        this.toastr.success('Usuario expulsado exitosamente');
        // Actualizar la lista de miembros
        this.forumService.getForumMembers(this.forum.id_forum).subscribe((membersData: IUserData[]) => {
          this.members = membersData;
        });
      },
      error: (error: any) => {
        console.error('Error al expulsar al usuario:', error);
        this.toastr.error('Error al expulsar al usuario');
      }
    });
  }

  toggleMembers() {
    this.showMembers = !this.showMembers;
  }

  leaveForum() {
    this.userService.leaveForum(this.forum.id_forum, this.current_id).subscribe({
      next: (data: any) => {
        this.toastr.success('Has abandonado el foro exitosamente');
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error al abandonar el foro:', error);
        this.toastr.error('Error al abandonar el foro');
      }
    });
  }
}
