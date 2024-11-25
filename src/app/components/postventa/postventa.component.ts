import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISalePost } from '../../models/isale-post';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SaleService } from '../../services/sale.service';
import { IUserData } from '../../models/iuser-data';

@Component({
  selector: 'app-postventa',
  standalone: true,
  imports: [CommonModule, MenuModule],
  templateUrl: './postventa.component.html',
  styleUrls: ['./postventa.component.css']
})
export class PostventaComponent implements OnInit{
  @Input() salePost!: ISalePost;
  items: MenuItem[] | undefined;
  user!: IUserData;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr : ToastrService,
    private saleService: SaleService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.items = [
      {
        items: [
          {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.deleteSale(this.salePost.id_sale_post)
          }
        ]
      }
    ];
  }

  deleteSale(id_sale_post: number) {
    this.saleService.deleteSalePost(id_sale_post).subscribe({
      next: () => {
        this.saleDeleted.emit(id_sale_post);
        this.toastr.success('Post eliminado correctamente');
      },
      error: () => {
        this.toastr.error('Error al eliminar el post');
      }
    });
  }
  @Output() saleDeleted = new EventEmitter<number>();
}
