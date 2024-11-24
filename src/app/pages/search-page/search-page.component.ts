import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GroupItemComponent } from '../../components/group-item/group-item.component';
import { PostComponent } from '../../components/post/post.component';
import { SearchService } from '../../services/search.service';
import { IForum } from '../../models/iforum';
import { IPost } from '../../models/ipost';
import { IUserData } from '../../models/iuser-data';
import { UserCardComponent } from "../../components/user-card/user-card.component";
@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule,
    NavbarComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    GroupItemComponent,
    PostComponent,
    UserCardComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit{
  searchValue = localStorage.getItem('search') || '';
  forums: IForum[] = [];
  users: IUserData[] = [];
  posts: IPost[] = [];
  noResults = false;
  currentSelection = 'forums';
  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
      this.updateNoResults();
    });
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
      this.updateNoResults();
    });
    this.searchService.searchPostsByTitle(this.searchValue).subscribe((data: any) => {
      this.posts = data;
      this.updateNoResults();
    });
  }

  filterByGroups() {
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
      this.noResults = false;
      this.users = [];
      this.posts = [];
      this.currentSelection = 'forums';
    });
  }

  filterByUsers() {
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
      this.noResults = false;
      this.forums = [];
      this.posts = [];
      this.currentSelection = 'users';
    });
  }

  filterByPosts() {
    this.searchService.searchPostsByTitle(this.searchValue).subscribe((data: any) => {
      this.posts = data;
      this.noResults = false;
      this.forums = [];
      this.users = [];
      this.currentSelection = 'posts';
    });

  }

  filterByUsersAndForums() {
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
    });
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
    });
    this.posts = [];
    this.currentSelection = 'both';
  }

  updateNoResults() {
    if (this.users.length === 0 && this.posts.length === 0 && this.forums.length === 0) {
      this.noResults = true;
    } 
  }

  updateSearch(search: string) {
    this.searchValue = search;
    this.ngOnInit();
  }

  search(search: string) {
    console.log(search);
    this.searchValue = search;
    this.ngOnInit();
  }
}
