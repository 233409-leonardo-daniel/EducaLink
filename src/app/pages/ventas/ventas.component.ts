import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PostventaComponent } from '../../components/postventa/postventa.component';
import { ISalePost } from '../../models/isale-post';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PostventaComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  salePosts: ISalePost[] = [];

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSalePosts();
  }

  loadSalePosts(): void {
    this.saleService.getSalePosts().subscribe(data => {
      this.salePosts = data;
    });
  }
}
