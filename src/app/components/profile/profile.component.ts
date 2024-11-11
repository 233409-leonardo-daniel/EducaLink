import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  name = 'Juan Vicente';
  role = 'Profesor de Primaria';
  profileImage = 'https://via.placeholder.com/40';

}
