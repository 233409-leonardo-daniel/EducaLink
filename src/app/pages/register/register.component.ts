import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { log } from 'console';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;  

  constructor(readonly authService: AuthService, readonly router: Router, readonly messageService: MessageService, readonly userService: UserService) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email]),
      education_level: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      user_type: new FormControl('User'),
      state: new FormControl('Activo')
    });
  }

  setData() {
   this.authService.register(this.registerForm.value).pipe(
    catchError((error) => {
      if (error.status === 400) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El correo ya está registrado' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Algo salió mal' });
      }
      return of(error);
    })
   ).subscribe((res) => {
    console.log(res);
    this.authService.setToken(res.access_token);
    this.userService.setData(res.token_data);
    this.router.navigate(['/registergroup']);
   });
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
