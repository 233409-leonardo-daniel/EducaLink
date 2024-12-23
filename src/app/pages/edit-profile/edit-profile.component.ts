import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUserData } from '../../models/iuser-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  userData: IUserData = {} as IUserData;

  backgroundImageFile: File | null = null;
  profileImageFile: File | null = null;

  constructor(private userService: UserService, private router: Router, private toastr : ToastrService) {}

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
      const formData = new FormData();
      formData.append('user_id', this.userData.id_user.toString());
      formData.append('name', this.userData.name);
      formData.append('lastname', this.userData.lastname);
      formData.append('mail', this.userData.mail);
      formData.append('education_level', this.userData.education_level);
      formData.append('grade', this.userData.grade.toString());
      formData.append('state', this.userData.state);
      formData.append('user_type', this.userData.user_type);
      if (this.userData.password) {
        formData.append('password', this.userData.password);
      }
      if (this.backgroundImageFile) {
        formData.append('background_image', this.backgroundImageFile);
    } else {
        console.warn('No se seleccionó una imagen de fondo.');
    }

    if (this.profileImageFile) {
        formData.append('profile_image', this.profileImageFile);
    } else {
        console.warn('No se seleccionó una imagen de perfil.');
      }

      this.userService.updateUser(this.userData.id_user, formData).subscribe({
        next: () => {
          console.log('Perfil actualizado con éxito');
          this.router.navigate(['/profile', this.userData.id_user]);
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
        },
      });
    } else {
      this.toastr.error('Por favor, complete todos los campos obligatorios.');
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
      if (type === 'background') {
        this.backgroundImageFile = file;
      } else if (type === 'profile') {
        this.profileImageFile = file;
      }
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