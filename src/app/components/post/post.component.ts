import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IPost } from '../../models/ipost';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  constructor(private router: Router, private userService: UserService){ }
  @Input() post!: IPost;


  goProfile(id_user: number) {
    // console.log(id_user);
    // console.log(this.userService.getData().id_user);
    
    this.userService.setTempId(id_user);
    if (id_user == this.user.id_user) {
      this.router.navigate(['/profile', id_user])
    } else {
      console.log('oops, este es otro perfil');
      
      this.router.navigate(['/profile', id_user]);
    }
  }

  isImage(fileUrl: string): boolean {
    return fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') || fileUrl.endsWith('.gif');
  }
  @Output() id_user = new EventEmitter<number>();
}
