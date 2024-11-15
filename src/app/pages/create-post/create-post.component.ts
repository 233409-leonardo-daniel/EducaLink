import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { IForum } from '../../models/iforum';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [NavbarComponent, DropdownModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  forums: IForum[] = [];
  createPostForm: FormGroup;
  selectedFiles: Array<{ name: string, type: string, preview?: string }> = [];

  constructor(
    readonly userService: UserService, 
    readonly postService: PostService, 
    readonly authService: AuthService,
    readonly toastr: ToastrService,
    private router: Router
  ) {
      this.userService.getUserForums(this.userService.getData().id_user).subscribe((data: any) => {
        this.forums = data;
      });


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
        if (forum.name === this.createPostForm.value.forum.name) {
          this.postService.createPost(this.createPostForm.value.title, this.createPostForm.value.content, id).pipe(
            catchError((error) => {
              this.toastr.error('Error al crear la publicación');
              return of(error);
            })
          ).subscribe({
            next: () => {
              //Posible solucion a S3 Bucket <- Queda pendiente
              // this.selectedFiles.forEach((file: any) => {
              //   this.postService.uploadFile(file, data.id_post).subscribe();
              // });
              // this.router.navigate(['/home']);
              this.toastr.success('Publicación creada exitosamente');
            },
            error: () => {
              this.toastr.error('Error al crear la publicación');
            }
          });
        }
      });
    } else {
      this.toastr.error('Formulario inválido');
    }
  }

  selectFile(fileType: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType === 'image' ? 'image/*' : '.pdf,.doc,.docx';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const fileObject: { name: string, type: string, preview?: string } = { name: file.name, type: file.type };

        if (fileType === 'image') {
          const reader = new FileReader();
          reader.onload = () => {
            fileObject.preview = reader.result as string;  // Vista previa para imágenes
            this.selectedFiles.push(fileObject);
          };
          reader.readAsDataURL(file);
        } else {
          
          fileObject.preview = 'assets/file-icon.png';  
          this.selectedFiles.push(fileObject);
        }
      }
    };
    input.click();
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
