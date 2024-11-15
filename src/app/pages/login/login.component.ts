import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { log } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isRegisterModalOpen = false;

  constructor(readonly authService: AuthService, readonly messageService: MessageService, readonly userService: UserService, readonly router: Router, readonly toastr: ToastrService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).pipe(
        catchError((error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Correo o contraseña incorrectos' });
          return of(error);
        })
      ).subscribe(res => {
        if (res.token_data) {
          this.authService.setToken(res.access_token);
          this.userService.setData(res.token_data);
          localStorage.setItem('user', JSON.stringify(res.token_data));
          
          this.router.navigate(['/home']);
        } else {
          console.log(res);
          
        }
      });
    } else {
      this.toastr.error('Formulario inválido');
    }
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }
}
