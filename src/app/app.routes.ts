import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'createpost', component: CreatePostComponent }
];
