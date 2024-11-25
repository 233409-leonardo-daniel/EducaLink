import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ISalePost } from '../../models/isale-post';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.css'],
})
export class SaleModalComponent implements OnInit {
  @Input() postId!: number; 
  @Input() isVisible: boolean = false; 
  @Output() closeModal = new EventEmitter<void>(); 

  salePost: ISalePost | null = null; 
  seller: IUserData | null = null; 
  isLoading: boolean = true; 
  error: string | null = null; 

  constructor(
    private saleService: SaleService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalePost();
  }

  private loadSalePost(): void {
    this.isLoading = true;
    this.error = null;

    this.saleService.getSalePostById(this.postId).subscribe({
      next: (post) => {
        this.salePost = post;
        
        this.userService.getUserById(post.seller.id_user).subscribe({
          next: (user) => {
            this.seller = user;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'No se pudo cargar el perfil del vendedor.';
            console.error(err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        this.error = 'No se pudo cargar los detalles del post.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  goToChat(): void {
    if (this.seller) {
      this.router.navigate(['/chat'], {
        queryParams: { receiverId: this.seller.id_user },
      });
    }
  }
}
