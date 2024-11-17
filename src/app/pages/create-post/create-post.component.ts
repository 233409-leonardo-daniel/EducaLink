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
  selectedFiles: File[] = []; // Cambiado a tipo File

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
      const formData = new FormData();
      formData.append('title', this.createPostForm.value.title);
      formData.append('content', this.createPostForm.value.content);
      formData.append('forum_id', id.toString());

      // Agregar archivos seleccionados
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      this.postService.createPost(formData).pipe(
        catchError((error) => {
          this.toastr.error('Error al crear la publicación');
          return of(error);
        })
      ).subscribe({
        next: () => {
          this.toastr.success('Publicación creada exitosamente');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastr.error('Error al crear la publicación');
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
    input.multiple = true; // Permitir múltiples archivos
    input.onchange = (event: any) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
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