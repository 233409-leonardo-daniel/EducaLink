import { Component, Input } from '@angular/core';
import { IUserData } from '../../models/iuser-data';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() user: IUserData = {} as IUserData;

  goProfile() {
    this.userService.setTempId(this.user.id_user);
    this.router.navigate(['/profile', this.user.id_user]);
  }

  constructor(private router: Router, private userService: UserService) { }
}
