import { Component, Input } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';
import { IForum } from '../../models/iforum';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, GroupItemComponent],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  @Input() forums : IForum[] = []

  goGroups() { 
    this.userService.getTempId();
    if (!this.userService.getTempId()) {
      this.userService.setTempId(this.authService.getUser()?.id_user as number)
      this.router.navigate(['/user-forums']);
    }
    this.router.navigate(['/user-forums']);
  }
  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }
}
