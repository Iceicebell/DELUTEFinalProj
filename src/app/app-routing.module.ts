import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostAddComponent } from './post-add/post-add.component';
import { PostListComponent } from './post-list/post-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard'
import { ProfileComponent } from './profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['post-list']);
const routes: Routes = [{path:'', redirectTo: 'post-list', pathMatch:'full'},

{path: 'post-list', component: PostListComponent,
...canActivate(redirectUnauthorizedToLogin),},

 {path: 'login', component: LoginComponent,
 ...canActivate(redirectLoggedInToHome),
 },

 {path: 'register', component:RegisterComponent,
 ...canActivate(redirectLoggedInToHome),
},

{path: 'post-add', component: PostAddComponent,
...canActivate(redirectUnauthorizedToLogin),
},

{path: 'post-edit/:id', component: PostAddComponent,
...canActivate(redirectUnauthorizedToLogin),
},

{path: 'profile', component: ProfileComponent,
...canActivate(redirectUnauthorizedToLogin),},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
