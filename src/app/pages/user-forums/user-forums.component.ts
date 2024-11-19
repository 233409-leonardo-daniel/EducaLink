import { Component, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IForum } from '../../models/iforum';
import { GroupItemComponent } from '../../components/group-item/group-item.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-forums',
  standalone: true,
  imports: [NavbarComponent, CommonModule, GroupItemComponent],
  templateUrl: './user-forums.component.html',
  styleUrl: './user-forums.component.css'
})
export class UserForumsComponent implements OnInit {
  forums: IForum[] = []
  currentUser: any;
  id_user: any;
  
  ngOnInit() {
    // this.authService.getUser();
    this.currentUser = this.authService.getUser();
    this.id_user = this.userService.getTempId()
    if (this.id_user) {
      this.userService.getUserForums(this.id_user).subscribe((data) => {
        this.forums = data;
      });
      
    }
  }


  constructor(private userService: UserService, private authService: AuthService) { }
}
