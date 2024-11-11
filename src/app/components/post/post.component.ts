import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
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
}
