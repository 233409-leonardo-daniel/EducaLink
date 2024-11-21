import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GroupItemComponent } from "../../components/group-item/group-item.component";

@Component({
  selector: 'app-search-forum',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, GroupItemComponent],
  templateUrl: './search-forum.component.html',
  styleUrl: './search-forum.component.css'
})
export class SearchForumComponent implements OnInit {
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
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
    this.forumService.getAvailableForumsWithEducationLevelFilter(this.user.id_user, this.user.education_level).subscribe({
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
}
