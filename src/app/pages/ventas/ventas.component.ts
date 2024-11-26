import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PostventaComponent } from '../../components/postventa/postventa.component';
import { ISalePost } from '../../models/isale-post';
import { SaleService } from '../../services/sale.service';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    PostventaComponent, 
    RouterLink,
    MenuModule
  ],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})

export class VentasComponent implements OnInit {
  salePosts: ISalePost[] = [];
  originalPosts: ISalePost[] = []; // Para almacenar todos los posts originales.

  @ViewChild('filterMenuRef') filterMenuRef!: Menu;

  filterMenu: MenuItem[] = [
    {
      label: 'Material didáctico',
      icon: 'pi pi-box',
      command: () => this.filterByCategory('Material_didactico'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Recursos de clases',
      icon: 'pi pi-book',
      command: () => this.filterByCategory('Recursos_de_clase'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Juguetes',
      icon: 'pi pi-heart',
      command: () => this.filterByCategory('Juguetes'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Mobiliario y equipo',
      icon: 'pi pi-desktop',
      command: () => this.filterByCategory('Mobiliario'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Uniformes y ropa',
      icon: 'pi pi-user',
      command: () => this.filterByCategory('Uniformes'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Decoraciones',
      icon: 'pi pi-palette',
      command: () => this.filterByCategory('Decoracion'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Electrónica',
      icon: 'pi pi-mobile',
      command: () => this.filterByCategory('Electronica'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Libros',
      icon: 'pi pi-book',
      command: () => this.filterByCategory('Libros'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      label: 'Otros',
      icon: 'pi pi-ellipsis-h',
      command: () => this.filterByCategory('Otros'),
      styleClass: 'text-[#3A00AE] font-bold'
    },
    {
      separator: true
    },
    {
      label: 'Iniciar venta',
      icon: 'pi pi-plus',
      routerLink: '/salepost',
      styleClass: 'text-[#3A00AE] font-bold'
    }
  ];

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

  onSaleDeleted(id_sale_post: number): void {
    this.salePosts = this.salePosts.filter(post => post.id_sale_post !== id_sale_post);
  }

  openFilterMenu(event: Event): void {
    this.filterMenuRef.toggle(event);
  }
}