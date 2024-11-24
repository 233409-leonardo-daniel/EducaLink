import { Component, OnInit, Input } from '@angular/core';
import { IForum } from '../../models/iforum'; 
import { ForumService } from '../../services/forum.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-editforum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NavbarComponent, RouterLink],
  templateUrl: './editforum.component.html',
  styleUrl: './editforum.component.css'
})
export class EditforumComponent {
  forumForm!: FormGroup;
  userForums: IForum[] = [];
  forumId!: number;
  selectedForum!: IForum | undefined; // "Valencia" agregue el undefined para que pueda usar el canceledit
  userData!: IUserData;

  // "Valencia" propiedad para almacenar los grados disponibles
  availableGrades: number[] = [];

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtén los datos del usuario
    this.forumId = parseInt(localStorage.getItem('forumId') || '0');
    this.userData = this.userService.getData();
    const userId = this.userData.id_user;

    // Carga los foros del usuario
    this.loadUserForums(userId);

    // Inicializa el formulario vacío
    this.initForm();
  }

  cancelEdit(): void {
    this.selectedForum = undefined; 
    this.forumForm.reset(); 
  }
  

  // Carga la lista de foros del usuario
  loadUserForums(userId: number): void {
    this.forumService.getForumsByUser(userId).subscribe(
      (forums) => {
        this.userForums = forums;
      },
      (error) => {
        console.error('Error al cargar los foros del usuario:', error);
      }
    );
  }

  // Inicializa el formulario
  initForm(): void {
    this.forumForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      education_level: ['', Validators.required],
      grade: [''], 
      privacy: ['', Validators.required],
      password: [''],
      background_image_url: [''],
      image_url: ['']
    });
  }

   // Agregue este nuevo Método para cambiar los grados disponibles según el nivel educativo seleccionado
   onEducationLevelChange(event: Event): void {
    const selectedLevel = (event.target as HTMLSelectElement).value;
    if (selectedLevel === 'Preescolar') {
      this.availableGrades = [1, 2, 3];
    } else if (selectedLevel === 'Primaria') {
      this.availableGrades = [1, 2, 3, 4, 5, 6];
    } else {
      this.availableGrades = [];
    }
  }

  // Cargar los datos del foro seleccionado en el formulario
  loadForumData(forum: IForum): void {
    this.selectedForum = forum;
    this.forumForm.patchValue({
      name: forum.name,
      description: forum.description,
      education_level: forum.education_level,
      privacy: forum.privacy,
      password: forum.privacy === 'private' ? forum.password : '',
      background_image_url: forum.background_image_url,
      image_url: forum.image_url
    });
  }

  // Enviar los cambios al backend
  saveChanges(): void {
    if (!this.selectedForum) {
      console.error('No hay foro seleccionado');
      return;
    }

    const updatedForum: IForum = {
      ...this.selectedForum,
      ...this.forumForm.value
    };

    this.forumService.editForum(this.selectedForum.id_forum, updatedForum).subscribe(
      (response) => {
        console.log('Foro actualizado con éxito:', response);
      },
      (error) => {
        console.error('Error al actualizar el foro:', error);
      }
    );
  }
  
}
