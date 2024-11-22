import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PostventaComponent } from '../../components/postventa/postventa.component';
import { ISalePost } from '../../models/isale-post';
import { SaleService } from '../../services/sale.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PostventaComponent, RouterLink],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})

export class VentasComponent implements OnInit {
  salePosts: ISalePost[] = [];
  originalPosts: ISalePost[] = []; // Para almacenar todos los posts originales.

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSalePosts();
  }

  loadSalePosts(): void {
    this.saleService.getSalePosts().subscribe(data => {
      console.log('Todos los posts:', data);
      this.salePosts = data;
      this.originalPosts = data; // Guardar los posts originales.
    });
  }

  filterByCategory(category: string): void {
    if (category === 'Todos') {
      this.salePosts = [...this.originalPosts]; // Mostrar todos los posts.
    } else {
      this.saleService.getSalePostsByType(category).subscribe(data => {
        console.log(`Posts filtrados por categoría ${category}:`, data);
        this.salePosts = data;
      });
    }
  }
}