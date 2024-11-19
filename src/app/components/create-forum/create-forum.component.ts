import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IForum } from '../../models/iforum'; 
import { ForumService } from '../../services/forum.service';
import { IUserData } from '../../models/iuser-data';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-create-forum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private userService: UserService
  ) {
    this.forumForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      education_level: ['Preescolar', [Validators.required]],
      privacy: ['Publico', [Validators.required]],
      password: [''], // Validación condicional
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
    this.userData = this.userService.getData();
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
      // Prepara los datos según la interfaz IForum
      const formData: Partial<IForum> = {
        id_forum: 0, // Generado por el backend
        name: this.forumForm.value.name,
        description: this.forumForm.value.description,
        education_level: this.forumForm.value.education_level,
        privacy: this.forumForm.value.privacy,
        password: this.forumForm.value.privacy === 'Privado' ? this.forumForm.value.password : '',
        creation_date: new Date().toISOString(), // Fecha actual
        id_user: this.userData.id_user, // Usamos el ID del usuario actual
        user_name: this.userData.name, // Nombre del usuario actual
        members: 0,
        background_image_url: this.backgroundImageBase64 || '',
        image_url: this.imageBase64 || '',
        users_count: 0,
      };

      console.log(formData);

      this.forumService.createForum(formData as IForum).subscribe(
        (response) => {
          console.log('Foro creado exitosamente:', response);
          alert('Foro creado con éxito');
        },
        (error) => {
          console.error('Error al crear el foro:', error);
          alert('Error al crear el foro');
        }
      );
    } else {
      console.error('Formulario inválido o datos de usuario faltantes');
    }
  }
}
