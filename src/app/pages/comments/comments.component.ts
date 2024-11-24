import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { PostService } from '../../services/post.service';
import { IPost } from '../../models/ipost';
import { PostComponent } from '../../components/post/post.component';
import { UserService } from '../../services/user.service';
import { IComment } from '../../models/icomment';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { CommentService } from '../../services/comment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [NavbarComponent, PostComponent, CommonModule, DialogModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  tempId: number = 0;
  post: IPost = {} as IPost;
  comments: IComment[] = [];
  visible: boolean = false
  user: IUserData = {} as IUserData;
  commentForm: FormGroup;
  constructor(private postService: PostService, private userService: UserService, private toastr: ToastrService, private authService: AuthService, private commentService: CommentService, private router: Router) {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [Validators.required])
    });
  }
  
  ngOnInit() {
    this.tempId = this.userService.getTempId();
    console.log(this.tempId);
    this.user = this.authService.getUser() as IUserData;
    console.log(this.user);
    this.postService.getPostById(this.tempId).subscribe((post: IPost) => {
        this.post = post;
        console.log(this.post);
    });
    if (this.tempId !== 0) {
        this.postService.getCommentsByPostId(this.tempId).subscribe((comments: IComment[]) => {
            this.comments = comments;
            this.comments.sort((a, b) => new Date(b.comment_date).getTime() - new Date(a.comment_date).getTime());
            console.log(this.comments);
        });
    } else {
        console.error('El ID del post es 0, no se pueden cargar los comentarios.');
    }
  }

  showDialog() {
    this.visible = true;
  }

  goToUser(id_user: number) {
    this.userService.setTempId(id_user);
    this.router.navigate(['/profile', id_user]);
  }

  onSubmit(id_post: number) {
    this.commentService.createComment(this.commentForm.value.comment, id_post).subscribe((res: any) => {
      this.toastr.success('Comentario creado correctamente');
      this.commentForm.reset();
      this.ngOnInit();
    });
    this.visible = false;
  }

  deleteComment(id_comment: number) {
    this.commentService.deleteComment(id_comment).subscribe((res: any) => {
      this.toastr.success('Comentario eliminado correctamente');
      this.ngOnInit();
    });
  }
}
