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
      });
    });
  }

  editForum() {
    this.router.navigate(['/editforum']);
  }

  joinForum(id_forum: number) {
    this.userService.joinForum(id_forum).subscribe(
      (data: any) => {
        console.log(data);
        this.forumService.getForumMembers(this.forum.id_forum).subscribe((membersData: IUserData[]) => {
          this.members = membersData;
        });
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Error al unirse al foro');
      }
    );
  }
}
