import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SaleService } from '../../services/sale.service';
import { ISalePost } from '../../models/isale-post';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-sale-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './create-sale-post.component.html',
  styleUrls: ['./create-sale-post.component.css']
})
export class CreateSalePostComponent {
  createPostForm: FormGroup;
  selectedImageUrl: string | null = null;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    public router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  createPost(): void {
    if (this.createPostForm.valid) {
      const newPost: ISalePost = {
        title: this.createPostForm.value.title,
        description: this.createPostForm.value.description,
        price: parseFloat(this.createPostForm.value.price),
        url: this.selectedImageUrl || '',
        status: this.createPostForm.value.status,
        id_sale_post: 0, 
        publication_date: new Date().toISOString(),
        seller_id: this.authService.getUser()?.id_user || 0
      };

      this.saleService.createSalePost(newPost).subscribe({
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

  triggerFileInput(): void {
    this.imageInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result as string;
        this.toastr.success('Imagen seleccionada correctamente');
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.warning('No se seleccionó ninguna imagen', 'Advertencia');
    }
  }
}
