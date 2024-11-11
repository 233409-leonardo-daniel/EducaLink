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
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() background_image_url: string = '';
  @Input() image_url: string = '';
  @Input() education_level: string = '';
  @Input() privacy: string = '';
  @Input() password: string = '';
  @Input() id_forum: number = 0;
  @Input() creation_date: string = '';
  @Input() id_user: number = 0;
}
