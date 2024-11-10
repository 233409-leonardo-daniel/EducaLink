import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service'; 
import { IForum } from '../../models/iforum';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {
  forums: IForum[] = [];

  constructor(readonly userService: UserService) {
    this.userService.getForumSuggestions().subscribe((data) => {
      console.log(data);
      this.forums = data;
    });
  }

  ngOnInit(): void {
    
  }

  joinGroup(forum: IForum): void {
    alert(`Unido al grupo ${forum.name}`);
  }

 
}
