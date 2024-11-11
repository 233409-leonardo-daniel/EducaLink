import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  addPost(post: Post) {
    const currentPosts = this.postsSubject.value;
    this.postsSubject.next([post, ...currentPosts]);
  }
}
