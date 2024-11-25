import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ISalePost } from '../../models/isale-post';
import { IUserData } from '../../models/iuser-data';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sale-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.css'],
})
export class SaleModalComponent implements OnInit {
  @Input() postId!: number; 
  @Input() isVisible: boolean = false; 
  @Output() closeModal = new EventEmitter<void>();
  user!: IUserData;

  salePost: ISalePost | null = null; 
  seller: IUserData | null = null; 
  isLoading: boolean = true; 
  error: string | null = null; 

  constructor(
    private saleService: SaleService,
    private userService: UserService,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
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

  goToChat(id_user: number): void {
    this.chatService.createSaleChat(id_user).subscribe({
      next: () => {
        this.userService.setTempId(id_user);
        this.router.navigate(['/sale-chat']);
      },
      error: (err) => {
        if(err.status === 400) {
          this.userService.setTempId(id_user);
          this.router.navigate(['/sale-chat']);
        } else {
          this.toastr.error('Oops, ocurrio un error al crear el chat');
          console.error('Error al crear el chat:', err);
        }
      }
    });
  }
}
