import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-group-item',
  standalone: true,
  imports: [],
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.css'
})
export class GroupItemComponent {
  @Input() forum = {
    name: '',
    description:  '',	
    background_image_url: '',
    image_url: '',
    education_level: '',
    privacy: '',
    password: '',
    id_forum: 0,
    creation_date: '',
    user_name:  '',
    id_user: 0,
    users_count: 0
  }
}