
// help-section.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-help-section',
  standalone: true,
  templateUrl: './help-section.component.html',
  styleUrls: ['./help-section.component.css'],
  imports: [RouterLink,NavbarComponent],  
})
export class HelpSectionComponent {}