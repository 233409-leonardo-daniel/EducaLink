import { Component } from '@angular/core';
import { GroupComponent } from '../../components/group/group.component';
import { UserService } from '../../services/user.service';
import { IForum } from '../../models/iforum';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registergroup',
  standalone: true,
  imports: [GroupComponent],
  templateUrl: './registergroup.component.html',
  styleUrl: './registergroup.component.css'
})
export class RegistergroupComponent {
  forums: IForum[] = [];

  constructor(readonly userService: UserService, private toastr: ToastrService, private router: Router) {
    this.userService.getForumSuggestions().subscribe((data) => {
      this.forums = data;
    });
  }

  finalizar() {
    console.log(this.userService.getData().id_user);
    let user_id : number = this.userService.getData().id_user;
    this.userService.getUserForums(user_id).subscribe((data) => {
      console.log(data);
      if (data.length == null || data.length == 0) { 
        this.toastr.error('Escoge al menos un grupo')
      } else {
        this.router.navigate(['/home'])
      }
    })
  }
}
