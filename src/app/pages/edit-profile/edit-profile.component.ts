import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  userData: IUserData = {
    id_user: 0,
    name: '',
    lastname: '',
    background_image_url: '',
    profile_image_url: '',
    mail: '',
    education_level: '',
    user_type: '',
    creation_date: '',
    state: '',
    password: '',
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.getLoggedInUserId();
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      },
    });
  }

  saveChanges(form: NgForm): void {
    if (form.valid) {
      this.userService.updateUser(this.userData.id_user, this.userData).subscribe({
        next: () => {
          console.log('Perfil actualizado con éxito');
          this.router.navigate(['/profile', this.userData.id_user]);
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  triggerFileInput(type: 'background' | 'profile'): void {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.onchange = (event: Event) => this.onImageSelected(event, type);
    inputElement.click();
  }

  onImageSelected(event: Event, type: 'background' | 'profile'): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'background') {
          this.userData.background_image_url = reader.result as string;
        } else if (type === 'profile') {
          this.userData.profile_image_url = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('No se seleccionó un archivo o el archivo no es válido.');
    }
  }

  private getLoggedInUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id_user) {
      console.error('Usuario no logueado o ID no disponible.');
      this.router.navigate(['/login']); // Redirige al login si no hay usuario logueado
      return 0;
    }
    return user.id_user;
  }
}
