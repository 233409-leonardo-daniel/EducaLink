import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SaleService } from '../../services/sale.service';
import { ISalePost } from '../../models/isale-post';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-sale-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './create-sale-post.component.html',
  styleUrls: ['./create-sale-post.component.css']
})
export class CreateSalePostComponent {
  formData: ISalePost = {
    title: '',
    description: '',
    price: 0,
    image_url: '',
    status: '',
    id_sale_post: 0,
    publication_date: '',
    seller_id: 0,
    sale_type: ''
  };

  selectedImageUrl: string | null = null;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private saleService: SaleService,
    public router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  createPost(): void {
    if (this.validateFormData()) {
      this.formData.publication_date = new Date().toISOString();
      this.formData.seller_id = this.authService.getUser()?.id_user || 0;

      this.saleService.createSalePost(this.formData).subscribe({
        next: () => {
          this.toastr.success('Publicación creada exitosamente');
          this.router.navigate(['/sale']);
        },
        error: (err) => {
          this.toastr.error('Error creando publicación', 'Error');
          console.error('Error creando publicación:', err);
        }
      });
    } else {
      this.toastr.error('Por favor complete todos los campos correctamente', 'Formulario inválido');
    }
  }

  validateFormData(): boolean {
    return (
      this.formData.title.trim() !== '' &&
      this.formData.description.trim() !== '' &&
      this.formData.price > 0 &&
      this.formData.sale_type.trim() !== '' &&
      this.formData.status.trim() !== ''
    );
  }

  triggerFileInput(): void {
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.image_url = reader.result as string; // Guardamos en image_url
        this.selectedImageUrl = reader.result as string;
        this.toastr.success('Imagen seleccionada correctamente');
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.warning('No se seleccionó ninguna imagen', 'Advertencia');
    }
  }
}
