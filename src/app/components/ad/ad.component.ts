import { Component, Input } from '@angular/core';
import { IAd } from '../../models/iad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent {
  @Input() ad!: IAd;
}