import { Component, Input } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';
import { IForum } from '../../models/iforum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, GroupItemComponent],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  @Input() forums : IForum[] = []

  constructor() { }
}
