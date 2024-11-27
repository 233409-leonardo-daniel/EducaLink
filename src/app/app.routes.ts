import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { MygroupsComponent } from './pages/mygroups/mygroups.component';
import { RegistergroupComponent } from './pages/registergroup/registergroup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ChatComponent } from './components/chat/chat.component';
import { ForumComponent } from './pages/forum/forum.component';
import { CreateSalePostComponent } from './pages/create-sale-post/create-sale-post.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { UserForumsComponent } from './pages/user-forums/user-forums.component';
import { NewforumComponent } from './pages/newforum/newforum.component';
import { SearchForumComponent } from './pages/search-forum/search-forum.component';
import { MyfollowsComponent } from './pages/myfollows/myfollows.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { EditforumComponent } from './components/editforum/editforum.component';
import { SaleChatComponent } from './pages/sale-chat/sale-chat.component';
import { UserFollowingComponent } from './pages/user-following/user-following.component';
import { authGuard } from './auth/auth.guard';
import { AdsComponent } from './pages/ads/ads.component';
import { HelpComponent } from './pages/help/help.component';
import { HelpSectionComponent } from './components/help-section/help-section.component';
import { InfoComponent } from './components/info/info.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'createpost', component: CreatePostComponent, canActivate: [authGuard] },
    { path: 'registergroup', component: RegistergroupComponent, canActivate: [authGuard] },
    { path: 'mygroup', component: MygroupsComponent, canActivate: [authGuard] },
    { path: 'profile/:id_user', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'sale', component: VentasComponent, canActivate: [authGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
    { path: 'forum', component: ForumComponent, canActivate: [authGuard] },
    { path: 'salepost', component: CreateSalePostComponent, canActivate: [authGuard] },
    { path: 'user-forums', component: UserForumsComponent, canActivate: [authGuard] },
    { path: 'editprofile', component: EditProfileComponent, canActivate: [authGuard] },
    { path: 'createforum', component: NewforumComponent, canActivate: [authGuard] },
    { path: 'search-forum', component: SearchForumComponent, canActivate: [authGuard] },
    { path: 'editforum', component: EditforumComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchPageComponent, canActivate: [authGuard] },
    { path: 'comments', component: CommentsComponent, canActivate: [authGuard] },
    { path: 'sale-chat', component: SaleChatComponent, canActivate: [authGuard] },
    { path: 'user-following', component: UserFollowingComponent, canActivate: [authGuard] },
    { path: 'ads', component: AdsComponent, canActivate: [authGuard] }, 
    { path: 'info', component: HelpComponent, canActivate: [authGuard]  }, 
    { path: 'help-section', component: HelpSectionComponent, canActivate: [authGuard] },
    { path: 'categories/:category', component: InfoComponent, canActivate: [authGuard]  }
];
