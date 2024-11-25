import { Component, Input, OnInit } from '@angular/core';
import { IAd } from '../../models/iad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {
  @Input() ad!: IAd;

  ngOnInit() {
    if (!this.ad) {
      console.error('No se proporcionó un anuncio válido');
    }
  }
}