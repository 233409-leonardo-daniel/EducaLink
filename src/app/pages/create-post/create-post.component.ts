import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DropdownModule } from 'primeng/dropdown';
import { IForum } from '../../models/iforum';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../auth/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [NavbarComponent, DropdownModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  forums: IForum[] = [];
  forumsNames: string[] = [];
  createPostForm: FormGroup;

  constructor(readonly userService: UserService, readonly postService: PostService, readonly authService: AuthService) {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const objetoRecuperado = JSON.parse(userItem);
      this.userService.getUserForums(objetoRecuperado.id_user).subscribe((data: any) => {
        this.forums = data;
        this.forumsNames = data.map((forum: any) => forum.name);
        console.log(this.forumsNames);
      });
    }

    console.log(this.authService.getToken());

    this.createPostForm = new FormGroup({
      forum: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    }); 
  }

  createPost() {
    let id = this.createPostForm.value.forum.id_forum;
    if (this.createPostForm.valid) {
      this.forums.forEach((forum: IForum) => {
        if (forum.name === this.createPostForm.value.forum) {
          this.postService.createPost(this.createPostForm.value.title, this.createPostForm.value.content, id).subscribe((data: any) => {
            console.log(data);
          });
        }
      });
    } else {
      alert('Formulario inválido');
    }
  }
}
