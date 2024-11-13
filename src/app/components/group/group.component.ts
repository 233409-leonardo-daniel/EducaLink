import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../../services/user.service'; 
import { IForum } from '../../models/iforum';


@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  forums: IForum[] = [];

  constructor(
    readonly userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getForumSuggestions().subscribe((data) => {
        console.log(data);
        this.forums = data;
      });
    } else {
      console.warn('Not running in the browser, skipping data loading in GroupComponent');
    }
  }

  joinGroup(id_forum: number): void {
    this.userService.joinForum(id_forum).subscribe((res) => {
      alert('Unido al grupo');
    });
  }


}
