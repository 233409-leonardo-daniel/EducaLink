import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { AuthService } from '../../auth/auth.service';
import { IUserData } from '../../models/iuser-data';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAd } from '../../models/iad';
import { AdService } from '../../services/ad.service';
import { ToastrService } from 'ngx-toastr';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [
    NavbarComponent, 
    ReactiveFormsModule, 
    FloatLabelModule, 
    InputTextModule, 
    NgClass, 
    TableModule, 
    DatePipe,
    DialogModule
  ],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.css'
})
export class AdsComponent implements OnInit {
  user: IUserData = {} as IUserData;
  ads: IAd[] = [];
  adForm: FormGroup;
  visible: boolean = false;

  constructor(
    private authService: AuthService,
    private adService: AdService,
    private toastr: ToastrService
  ){
    this.adForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      link: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser() as IUserData;
    this.loadAds();
  }

  loadAds(){
    this.adService.getAds().subscribe({
      next: (ads) => {
        this.ads = ads;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.adForm.patchValue({
      image: file
    });
  }

  createAd() {
    if(this.adForm.valid) {
      const formData = new FormData();
      formData.append('title', this.adForm.get('title')?.value);
      formData.append('description', this.adForm.get('description')?.value);
      formData.append('image', this.adForm.get('image')?.value);
      formData.append('link', this.adForm.get('link')?.value);

      this.adService.createAd(formData).subscribe({
        next: (ad) => {
          this.adForm.reset();
          this.loadAds();
          this.visible = false;
          this.toastr.success('Anuncio creado exitosamente');
        },
        error: (error) => {
          this.toastr.error(error.error.detail || 'Error al crear el anuncio');
          this.visible = false;
        }
      });
    } else {
      this.toastr.error('Por favor, complete todos los campos');
    }
  }

  deleteAd(id: number) {
    this.adService.deleteAd(id).subscribe({
      next: () => {
        this.toastr.success('Anuncio eliminado exitosamente');
        this.loadAds();
      },
      error: (error) => {
        this.toastr.error(error.error.detail || 'Error al eliminar el anuncio');
      }
    });
  }

  showDialog() {
    this.visible = true;
    this.adForm.reset();
  }
}
