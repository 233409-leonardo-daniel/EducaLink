import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterGroupComponent } from './pages/register-group/register-group/register-group.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path:'register', component: RegisterComponent },
    { path:'groupregistration', component: RegisterGroupComponent},
];
