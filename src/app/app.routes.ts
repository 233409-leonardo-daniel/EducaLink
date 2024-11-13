import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { MygroupsComponent } from './pages/mygroups/mygroups.component';
import { RegistergroupComponent } from './pages/registergroup/registergroup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'createpost', component: CreatePostComponent },
    { path: 'registergroup', component: RegistergroupComponent},
    { path: 'mygroup', component: MygroupsComponent},
    { path: 'profile/:id_user', component: ProfileComponent},
    { path: 'myprofile', component: MyprofileComponent},
];
