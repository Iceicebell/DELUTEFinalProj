import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostAddComponent } from './post-add/post-add.component';
import { PostListComponent } from './post-list/post-list.component';

const routes: Routes = [{path:'', redirectTo: 'post-list', pathMatch:'full'},
{path: 'post-list', component: PostListComponent},
// {path: 'login', component: LoginComponent},
// {path: 'register', component: RegisterComponent},
{path: 'post-add', component: PostAddComponent},
{path: 'post-edit/:id', component: PostAddComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
