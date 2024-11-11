import { Component } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [GroupItemComponent],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {}
