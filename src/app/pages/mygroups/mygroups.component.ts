import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GroupListComponent } from '../../components/group-list/group-list.component';

@Component({
  selector: 'app-mygroups',
  standalone: true,
  imports: [NavbarComponent, GroupListComponent],
  templateUrl: './mygroups.component.html',
  styleUrl: './mygroups.component.css'
})
export class MygroupsComponent {

}
