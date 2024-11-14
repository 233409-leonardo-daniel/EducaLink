import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IPost } from '../../models/ipost';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  constructor(private router: Router, private userService: UserService){ }
  @Input() post = {
    content: '',
    forum_id: 0,
    id_post: 0,
    user_id: 0,
    comment_count: 0,
    user_name: '',
    user_education_level: '',
    user_profile_image_url: '',
    publication_date: ''
  }

  goProfile(id_user: number) {
    console.log(id_user);
    console.log(this.userService.getData().id_user);
    
    
    if (id_user == this.userService.getData().id_user) {
      this.router.navigate(['/profile', id_user])
    } else {
      console.log('gwent');
      
      this.router.navigate(['/profile', id_user]);
    }
  }

  @Output() id_user = new EventEmitter<number>();
}
