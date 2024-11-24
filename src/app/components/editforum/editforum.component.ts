import { Component, OnInit, Input } from '@angular/core';
import { IForum } from '../../models/iforum'; 
import { ForumService } from '../../services/forum.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-editforum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NavbarComponent, RouterLink, FormsModule],
  templateUrl: './editforum.component.html',
  styleUrl: './editforum.component.css'
})
export class EditforumComponent implements OnInit{
  forumForm!: FormGroup;
  userForums: IForum[] = [];
  forumId!: number;
  selectedForum!: IForum | undefined; // "Valencia" agregue el undefined para que pueda usar el canceledit
  userData!: IUserData;
  groupImageFile: File | null = null;
  backgroundImageFile: File | null = null;
  changePassword: boolean = false;
  
  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.forumForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        education_level: new FormControl('', Validators.required),
        grade: new FormControl(''), 
        password: new FormControl(''),
        background_image_url: new FormControl(''),
        image_url: new FormControl('')
    });
  }

  
  ngOnInit(): void {
    // Obtén los datos del usuario
    this.forumId = parseInt(localStorage.getItem('forumId') || '0');
    this.userData = this.authService.getUser() as IUserData;
    this.loadFormData();
  }

  cancelEdit(): void {
    this.selectedForum = undefined; 
    this.forumForm.reset(); 
  }

  loadFormData() {
    this.forumService.getForumById(this.forumId).subscribe({
      next: (forum) => {
        this.loadForumData(forum);
      },
      error: (error: any) => {
        console.error('Error al cargar el foro:', error);
      }
    });
  }

  // Cargar los datos del foro seleccionado en el formulario
  loadForumData(forum: IForum): void {
    this.selectedForum = forum;
    this.forumForm.patchValue({
      name: forum.name,
      description: forum.description,
      education_level: forum.education_level,
      grade: forum.grade
    });
  }

  // Enviar los cambios al backend
  saveChanges(): void {
    if (!this.selectedForum) {
        console.error('No hay foro seleccionado');
        return;
    }
    if (this.forumForm.valid) {
        const formData = new FormData();
        formData.append('name', this.forumForm.get('name')?.value);
        formData.append('description', this.forumForm.get('description')?.value);
        formData.append('password', this.forumForm.get('password')?.value);
        
        // Asegúrate de que 'grade' sea un número
        const gradeValue = this.forumForm.get('grade')?.value;
        if (gradeValue) {
            formData.append('grade', parseInt(gradeValue, 10).toString());
        }

        formData.append('education_level', this.forumForm.get('education_level')?.value);
        
        // Agregar imágenes si están presentes
        if (this.groupImageFile) {
            formData.append('image', this.groupImageFile);
        }
        if (this.backgroundImageFile) {
            formData.append('background_image', this.backgroundImageFile);
        }

        this.forumService.editForum(this.selectedForum.id_forum, formData).subscribe({
            next: (response) => {
                this.toastr.success('Foro actualizado con éxito');  
                this.forumService.setTempId(this.forumId);
                this.router.navigate(['/forum']);
            },
            error: (error: any) => {
                this.toastr.error('Error al actualizar el foro');
                console.error('Error al actualizar el foro:', error);
            }
        });
    }
  }

  triggerFileInput(type: 'background' | 'group'): void {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.onchange = (event: Event) => this.onImageSelected(event, type);
    inputElement.click();
  }
  
  onImageSelected(event: Event, type: 'background' | 'group'): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      if (type === 'background') {
        this.backgroundImageFile = file;
      } else if (type === 'group') {
        this.groupImageFile = file;
      }
    } else {
      console.warn('No se seleccionó un archivo o el archivo no es válido.');
    }

  }
}
