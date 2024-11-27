import { Component, OnInit } from '@angular/core';
import { GroupComponent } from '../../components/group/group.component';
import { UserService } from '../../services/user.service';
import { IForum } from '../../models/iforum';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registergroup',
  standalone: true,
  imports: [GroupComponent, CommonModule],
  templateUrl: './registergroup.component.html',
  styleUrl: './registergroup.component.css'
})
export class RegistergroupComponent implements OnInit{
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
  constructor(readonly forumService: ForumService, private toastr: ToastrService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.forumService.getAvailableForumsWithDoubleFilters(this.user.id_user, this.user.grade, this.user.education_level).subscribe((data) => {
      this.forums = data.filter(forum => forum.privacy == 'Publico');
    });
  }

  finalizar() {
    console.log(this.user.id_user);
    let user_id : number = this.user.id_user;
    this.forumService.getForumsByUser(user_id).subscribe((data) => {
      console.log(data);
      if (data.length == null || data.length == 0) { 
        this.toastr.error('Escoge al menos un grupo')
      } else {
        this.router.navigate(['/home'])
      }
    })
  }
}
