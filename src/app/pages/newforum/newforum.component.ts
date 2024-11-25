import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CreateForumComponent } from '../../components/create-forum/create-forum.component';
import { EditforumComponent } from '../../components/editforum/editforum.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newforum',
  standalone: true,
  imports: [NavbarComponent, CreateForumComponent, RouterLink],
  templateUrl: './newforum.component.html',
  styleUrl: './newforum.component.css'
})
export class NewforumComponent {

}
