import { Component, OnInit, Input } from '@angular/core';
import { IForum } from '../../models/iforum'; 
import { ForumService } from '../../services/forum.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-editforum',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editforum.component.html',
  styleUrl: './editforum.component.css'
})
export class EditforumComponent {
  forumForm!: FormGroup;
  userForums: IForum[] = [];
  selectedForum!: IForum;
  userData!: IUserData;

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtén los datos del usuario
    this.userData = this.userService.getData();
    const userId = this.userData.id_user;

    // Carga los foros del usuario
    this.loadUserForums(userId);

    // Inicializa el formulario vacío
    this.initForm();
  }

  // Carga la lista de foros del usuario
  loadUserForums(userId: number): void {
    this.userService.getUserForums(userId).subscribe(
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
      privacy: ['', Validators.required],
      password: [''],
      background_image_url: [''],
      image_url: ['']
    });
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
