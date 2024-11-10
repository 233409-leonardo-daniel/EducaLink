import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../services/group.service';

interface Group {
  image: string;
  name: string;
  admin: string;
  members: number;
  isPublic: boolean;
  description: string;
}

@Component({
  selector: 'app-register-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-group.component.html',
  styleUrl: './register-group.component.css'
})
export class RegisterGroupComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
    });
  }

  joinGroup(group: Group): void {
    alert(`Unido al grupo ${group.name}`);
  }

  finalize(): void {
    alert('Finalizado');
  }

}
