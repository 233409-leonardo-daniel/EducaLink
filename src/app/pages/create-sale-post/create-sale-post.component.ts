import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  image: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    public router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.createPostForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]),
      category: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required),
    });
  }

  createPost(): void {
    if (this.createPostForm.valid) {
      const formData = new FormData();
      
      formData.append('title', this.createPostForm.value.title);
      formData.append('description', this.createPostForm.value.description);
      formData.append('price', this.createPostForm.value.price.toString());
      formData.append('type', this.createPostForm.value.category);
      
      if (this.image) {
        formData.append('image', this.image);
      } else {
        console.error('No se seleccionó ninguna imagen');
      }

      this.saleService.createSalePost(formData).subscribe({
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
      console.log('Estado del formulario:', this.createPostForm.value);
      console.log('Errores del formulario:', this.createPostForm.errors);
      Object.keys(this.createPostForm.controls).forEach(key => {
        const control = this.createPostForm.get(key);
        console.log(`${key} válido:`, control?.valid);
        console.log(`${key} errores:`, control?.errors);
      });
      
      this.toastr.error('Por favor complete todos los campos correctamente');
    }
  }

  triggerFileInput(): void {
    this.imageInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.image = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.image);
    }
  }
  

  // Convertir archivo a base64
  convertFileToBase64(file: File, callback: (base64: string | null) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.onerror = () => {
      console.error('Error al convertir el archivo a base64');
      callback(null);
    };
    reader.readAsDataURL(file);
  }
}
