import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { log } from 'console';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  grades: number[] = []; // Almacena los grados según el nivel académico seleccionado.
  constructor(
    readonly authService: AuthService,
    readonly router: Router,
    readonly messageService: MessageService,
    readonly userService: UserService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      mail: new FormControl('', [Validators.required, Validators.email]),
      education_level: new FormControl('', Validators.required),
      grade: new FormControl({ value: '', disabled: true }, Validators.required), 
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      user_type: new FormControl('User'),
      state: new FormControl('Activo'),
    });
  }

  ngOnInit(): void {
    this.registerForm.get('education_level')?.valueChanges.subscribe((level: string) => {
      this.updateGrades(level);
    });
  }

  updateGrades(level: string): void {
    if (level === 'Preescolar') {
      this.grades = [1, 2, 3];
    } else if (level === 'Primaria') {
      this.grades = [1, 2, 3, 4, 5, 6];
    } else {
      this.grades = [];
    }

    const gradeControl = this.registerForm.get('grade');
    if (this.grades.length > 0) {
      gradeControl?.enable();
    } else {
      gradeControl?.disable();
      gradeControl?.reset(); // Reinicia el valor del control si no hay grados disponibles
    }
  }

  setData(): void {
    this.authService
      .register(this.registerForm.value)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'El correo ya está registrado',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Algo salió mal',
            });
          }
          return of(error);
        })
      )
      .subscribe(() => {
        this.authService
          .login(this.registerForm.value.mail, this.registerForm.value.password)
          .subscribe((res) => {
            this.authService.setToken(res.access_token);
            this.userService.setData(res.token_data);
            localStorage.setItem('user', JSON.stringify(res.token_data));
            this.router.navigate(['/registergroup']);
          });
      });
  }

  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }
}