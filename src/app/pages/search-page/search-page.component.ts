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
import { ISalePost } from '../../models/isale-post';
import { PostventaComponent } from '../../components/postventa/postventa.component';
import { GroupComponent } from "../../components/group/group.component";
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
    UserCardComponent,
    PostventaComponent, GroupComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit{
  searchValue = localStorage.getItem('search') || '';
  forums: IForum[] = [];
  users: IUserData[] = [];
  posts: IPost[] = [];
  
  noResults = false;
  currentSelection = 'all';
  sales: ISalePost[] = [];
  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.getAllResults();
  }

  getAllResults() {
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
      console.log(this.forums);
      if (this.forums.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
      if (this.users.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
    this.searchService.searchSalesByTitle(this.searchValue).subscribe((data: any) => {
      this.sales = data;
      if (this.sales.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
    this.currentSelection = 'all';

    this.searchService.searchPostsByTitle(this.searchValue).subscribe((data: any) => {
      this.posts = data;
      if (this.posts.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
  }

  filterByGroups() {
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
      if (this.forums.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
      this.users = [];
      this.posts = [];
      this.sales = [];
      this.currentSelection = 'forums';
    });
  }

  filterByUsers() {
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
      if (this.users.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
      this.forums = [];
      this.posts = [];
      this.sales = [];
      this.currentSelection = 'users';
    });
  }

  filterByPosts() {
    this.searchService.searchPostsByTitle(this.searchValue).subscribe((data: any) => {
      this.posts = data;
      if (this.posts.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
      this.forums = [];
      this.users = [];
      this.sales = [];
      this.currentSelection = 'posts';
    });

  }

  filterBySales() {
    this.searchService.searchSalesByTitle(this.searchValue).subscribe((data: any) => {
      this.sales = data;
      if (this.sales.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
      this.forums = [];
      this.users = [];
      this.posts = [];
      this.currentSelection = 'sales';
    });
  }

  filterByUsersAndForums() {
    this.searchService.searchUsersByName(this.searchValue).subscribe((data: any) => {
      this.users = data;
      if (this.users.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
    this.searchService.searchForumsByName(this.searchValue).subscribe((data: any) => {
      this.forums = data;
      if (this.forums.length === 0) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    });
    this.posts = [];
    this.currentSelection = 'both';
  }

  updateNoResults() {
    if (this.users.length === 0 && this.posts.length === 0 && this.forums.length === 0) {
      this.noResults = true;
    } else {
      this.noResults = false;
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
