import { IUserData } from './../../models/iuser-data';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, 
    CommonModule, 
    FormsModule,
    SidebarModule,
    ButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  user = {} as IUserData;
  name: string = '';
  education_level: string = '';
  profile_image_url: string = '';
  search: string = '';
  sidebarVisible: boolean = false;

  constructor(readonly authService: AuthService, readonly userService: UserService, private router: Router, private toastr : ToastrService) {

  }
  ngOnInit() {
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;
      this.userService.getUserById(this.user.id_user).subscribe({
        next: (data) => {
          this.user = data;
          this.name = data.name;
          this.education_level = data.education_level;
          this.profile_image_url = data.profile_image_url;
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
        }})
    }
  }

  goSearch() {
    localStorage.setItem('search', this.search);
    this.searchEvent.emit(this.search);
    this.router.navigate(['/search']);
  }

  @Output() searchEvent = new EventEmitter<string>();

  onAddPost(): void {
    // Aquí puedes agregar la lógica para redirigir al usuario a la página de crear publicación
    console.log('Añadir nueva publicación');
  }

  goProfile() {
    this.userService.setTempId(this.user.id_user);
    this.router.navigate([`/profile/'${this.user.id_user}`]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  editProfile() {
    this.userService.setTempId(this.user.id_user);
    this.router.navigate(['/editprofile']);
    this.menuOpen = false; 
  }

  logout() {
    this.authService.logout().subscribe ({
      next: (data) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastr.error('Error al cerrar sesión', 'Error');
      }
    });
    this.menuOpen = false; 
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
