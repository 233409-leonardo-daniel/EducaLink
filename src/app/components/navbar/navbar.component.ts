import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  name = this.user.name || 'Nombre no disponible';
  education_level = this.user.education_level || 'Profesor de Primaria';
  profileImage = 'https://via.placeholder.com/40';
}
