import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISalePost } from '../../models/isale-post';

@Component({
  selector: 'app-postventa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postventa.component.html',
  styleUrls: ['./postventa.component.css']
})
export class PostventaComponent {
  @Input() salePost!: ISalePost;
}
