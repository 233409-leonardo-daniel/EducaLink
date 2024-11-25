import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IForum } from '../../models/iforum'; 
import { ForumService } from '../../services/forum.service';
import { IUserData } from '../../models/iuser-data';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-forum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-forum.component.html',
  styleUrl: './create-forum.component.css'
})
export class CreateForumComponent {
  forumForm: FormGroup;
  backgroundImageBase64: string | null = null;
  imageBase64: string | null = null;
  userData: IUserData | null = null;

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {
    this.forumForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      education_level: ['Preescolar', [Validators.required]],
      privacy: ['Publico', [Validators.required]],
      password: [''], // Validación condicional
      grade: ['0', [Validators.required]]
    });

    // Validación dinámica para la contraseña
    this.forumForm.get('privacy')?.valueChanges.subscribe((value) => {
      const passwordControl = this.forumForm.get('password');
      if (value === 'Privado') {
        passwordControl?.setValidators([Validators.required]);
      } else {
        passwordControl?.clearValidators();
      }
      passwordControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Obtener datos del usuario actual
    this.userData = this.authService.getUser();
    if (!this.userData || !this.userData.id_user) {
      console.error('No se encontró información del usuario actual');
    }
  }

  // Convertir archivo a base64
  convertFileToBase64(file: File, callback: (base64: string | null) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.onerror = () => {
      console.error('Error al convertir el archivo a base64');
      callback(null);
    };
    reader.readAsDataURL(file);
  }

  onBackgroundImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.convertFileToBase64(file, (base64) => {
        this.backgroundImageBase64 = base64;
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.convertFileToBase64(file, (base64) => {
        this.imageBase64 = base64;
      });
    }
  }

  onSubmit(): void {
    if (this.forumForm.valid && this.userData) {
      const formData = new FormData();
      formData.append('name', this.forumForm.value.name);
      formData.append('description', this.forumForm.value.description);
      formData.append('education_level', this.forumForm.value.education_level);
      formData.append('privacy', this.forumForm.value.privacy);
      formData.append('password', this.forumForm.value.password);
      formData.append('grade', this.forumForm.value.grade);
      if (this.imageBase64) {
        const imageBlob = this.dataURItoBlob(this.imageBase64);
        formData.append('image', imageBlob, 'image.png');
      }
      if (this.backgroundImageBase64) {
        const backgroundImageBlob = this.dataURItoBlob(this.backgroundImageBase64);
        formData.append('background_image', backgroundImageBlob, 'background.png');
      }
  

  
      this.forumService.createForum(formData).subscribe({
        next: (response) => {
          this.toastr.success('Foro creado exitosamente');
          this.forumService.setTempId(response.id_forum);
          // this.router.navigate(['/forum']);
        },
        error: (error) => {
          console.error('Error al crear el foro:', error);
          this.toastr.error('Error al crear el foro');
        }
      });
    } else {
      this.toastr.error('Formulario inválido o datos de usuario faltantes');
    }
  }

  // Método para convertir base64 a Blob
  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
