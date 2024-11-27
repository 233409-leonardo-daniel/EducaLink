import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupItemComponent } from "../../components/group-item/group-item.component";
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-search-forum',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, GroupItemComponent, MenuModule],
  templateUrl: './search-forum.component.html',
  styleUrl: './search-forum.component.css'
})
export class SearchForumComponent implements OnInit {
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
  @ViewChild('filterMenuRef') filterMenuRef!: Menu;

  filterMenu: MenuItem[] = [
    {
      label: 'Recomendados para ti',
      icon: 'pi pi-star',
      command: () => this.filterByRecommended(),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Grupos de preescolar',
      icon: 'pi pi-filter',
      command: () => this.filterByEducationLevel('Preescolar'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Grupos de primaria',
      icon: 'pi pi-filter',
      command: () => this.filterByEducationLevel('Primaria'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Todos',
      icon: 'pi pi-filter-slash',
      command: () => this.getAllForums(),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      separator: true
    },
    {
      label: 'Crear grupo',
      icon: 'pi pi-plus',
      routerLink: '/createforum',
      styleClass: 'text-[#3A00AE] font-bold'
    }
  ];

  constructor(private forumService: ForumService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser() as IUserData;
    this.forumService.getAvailableForumsWithDoubleFilters(this.user.id_user, this.user.grade, this.user.education_level).subscribe({
      next: (forums) => {
        this.forums = forums;
      },
      error: (err) => {
        console.error('Error al obtener foros:', err);
      }
    });
  }

  filterByRecommended() {
    this.forumService.getAvailableForumsWithDoubleFilters(this.user.id_user, this.user.grade, this.user.education_level).subscribe({
      next: (forums) => {
        this.forums = forums;
      },
      error: (err) => {
        console.error('Error al obtener foros recomendados:', err);
      }
    });
  }

  filterByEducationLevel(education_level: string) {
    this.forumService.getAvailableForumsWithEducationLevelFilter(this.user.id_user, education_level).subscribe({
      next: (forums) => {
        this.forums = forums;
      },
      error: (err) => {
        console.error('Error al obtener foros por nivel de educación:', err);
      }
    });
  }

  getAllForums() {
    this.forumService.getAvailableForums(this.user.id_user).subscribe({
      next: (forums) => {
        this.forums = forums;
      },
      error: (err) => {
        console.error('Error al obtener todos los foros:', err);
      }
    });
  }

  openFilterMenu(event: Event): void {
    this.filterMenuRef.toggle(event);
  }
}
