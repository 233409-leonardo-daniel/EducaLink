import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostInputComponent } from '../../components/post-input/post-input.component';
import { PostComponent } from '../../components/post/post.component';
import { GroupListComponent } from '../../components/group-list/group-list.component';
import { PostService } from '../../services/post.service';

interface Post {
  name: string;
  description: string;
  background_image_url: string;
  image_url: string;
  education_level: string;
  privacy: string;
  creation_date: string;
  id_user: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostInputComponent, PostComponent, GroupListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService]
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.posts$.subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }
}
