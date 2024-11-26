import { ForumService } from './../../services/forum.service';
import { IPost } from './../../models/ipost';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostInputComponent } from '../../components/post-input/post-input.component';
import { PostComponent } from '../../components/post/post.component';
import { GroupListComponent } from '../../components/group-list/group-list.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IForum } from '../../models/iforum';
import { Router } from '@angular/router';
import { IUserData } from '../../models/iuser-data';
import { FollowingSideComponent } from '../../components/following-side/following-side.component';
import { RightSidePanelComponent } from "../../components/right-side-panel/right-side-panel.component";
import { switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { forkJoin, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    PostInputComponent, 
    PostComponent, 
    GroupListComponent, 
    NavbarComponent, 
    FollowingSideComponent, 
    RightSidePanelComponent,
    ScrollingModule,
    CdkScrollableModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  idForums: number[] = [];
  forums: IForum[] = [];
  user: IUserData = {} as IUserData;
  idFollowed: number[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly postService: PostService,
    private readonly forumService: ForumService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user = userData;
      this.filterByRecommended(userData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  filterByRecommended(user: IUserData): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.forumService.getForumsByUser(user.id_user).pipe(
      takeUntil(this.destroy$),
      switchMap((forums: IForum[]) => {
        this.forums = forums;
        const postRequests = forums.map(forum => 
          this.postService.getPostsByForumExcludeUser(forum.id_forum, user.id_user)
        );
        
        return forkJoin(postRequests).pipe(
          map((postsArrays: IPost[][]) => {
            return postsArrays
              .flat()
              .sort((a: IPost, b: IPost) => 
                new Date(b.publication_date).getTime() - 
                new Date(a.publication_date).getTime()
              );
          })
        );
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (posts: IPost[]) => {
        this.posts = posts;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar posts:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  filterByFollowed(): void {
    this.userService.getFollowing(this.user.id_user).subscribe({
      next: (data: IUserData[]) => {
        console.log(data);
        this.idFollowed = data.map((user: IUserData) => user.id_user);
        for (const id of this.idFollowed) {
          this.postService.getPostsByUserWhereIsPrivateAndPublic(id).subscribe({
            next: (data: IPost[]) => {
              this.posts = data;
            },
            error: (err) => {
            console.error('Error al obtener publicaciones:', err);
            }
          });
        }
      }
    });
  }

  goPost(): void {
    this.router.navigate(['/createpost']);
  }

  onPostDeleted(id_post: number) {
    this.posts = this.posts.filter(post => post.id_post !== id_post);
  }

  trackByFn(index: number, post: IPost): number {
    return post.id_post;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
