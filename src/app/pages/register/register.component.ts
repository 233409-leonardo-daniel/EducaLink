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
      // user_type: new FormControl('User'), <- no se necesita PERO, EN EL BACKEND ESTA EL USER POR DEFECTO, SE PUEDE PONER ADMIN O USER
      // state: new FormControl('Activo') <- no se necesita PERO, EN EL BACKEND ESTA ACTIVO POR DEFECTO
    });
  }

  setData() {
   this.authService.register(this.registerForm.value).pipe(
    catchError((error) => {
      console.log(error);
      return of(error);
    })
   ).subscribe((res) => {
    this.userService.setData(res.user);
    this.router.navigate(['/groupregistration']);
   });
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
