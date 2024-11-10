import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
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

  constructor(readonly authService: AuthService, readonly router: Router, readonly messageService: MessageService, readonly userService: UserService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    }); 
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const data = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }
      this.authService.login(data).subscribe((res) => {
        console.log(res);
        localStorage.setItem('token', res.access_token);
        this.authService.setLoggedIn(true);
        this.userService.setData(res.token_data);
        console.log(this.userService.getData());
        this.router.navigate(['/groupregistration']);
      });
    }
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }
}
