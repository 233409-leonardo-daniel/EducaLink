import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  name: string = '';
  education_level: string = '';
  profile_image_url: string = '';

  constructor(readonly authService: AuthService) {
    this.name = this.user.name || 'Nombre no disponible';
    this.education_level = this.user.education_level || 'Profesor de Primaria';
    this.profile_image_url = this.user.profile_image_url || 'https://via.placeholder.com/40';
  }

  ngOnInit(): void {
    // Puedes cargar datos adicionales si es necesario
  }

  onAddPost(): void {
    // Aquí puedes agregar la lógica para redirigir al usuario a la página de crear publicación
    console.log('Añadir nueva publicación');
  }
}
