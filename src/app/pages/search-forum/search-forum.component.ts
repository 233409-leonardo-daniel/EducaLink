import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AsideComponent } from '../../components/aside/aside.component';
import { IForum } from '../../models/iforum';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';

@Component({
  selector: 'app-search-forum',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './search-forum.component.html',
  styleUrl: './search-forum.component.css'
})
export class SearchForumComponent implements OnInit {
  forums: IForum[] = [];
  user = {} as IUserData;
  constructor(private forumService: ForumService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser() as IUserData;
    this.forumService.getForumsByGradeAndEducationLevel(this.user.grade, this.user.education_level).subscribe((forums) => {
      this.forums = forums;
      console.log(this.forums);
    });
  }
}
