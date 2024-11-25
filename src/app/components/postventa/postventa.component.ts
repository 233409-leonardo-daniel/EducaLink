import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISalePost } from '../../models/isale-post';
import { SaleModalComponent } from '../sale-modal/sale-modal.component';

@Component({
  selector: 'app-postventa',
  standalone: true,
  imports: [CommonModule, SaleModalComponent ],
  templateUrl: './postventa.component.html',
  styleUrls: ['./postventa.component.css']
})
export class PostventaComponent {
  @Input() salePost!: ISalePost;
  isModalVisible: boolean = false;

  // Método para abrir el modal
  openModal(): void {
    this.isModalVisible = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalVisible = false;
  }
}
