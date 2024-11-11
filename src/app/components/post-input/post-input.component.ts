import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.css'
})
export class PostInputComponent {
  

  constructor(readonly router: Router) {}

  goPost() {
    this.router.navigate(['/createpost']);
  }
}
