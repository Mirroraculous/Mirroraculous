import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/auth-guard.service';
import { GoogleAuthComponent } from './components/googleauth/googleauth.component'
import { SessionService } from './auth/session.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'register', component: RegisterPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent , canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'googleAuth', component: GoogleAuthComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard],
})
export class AppRoutingModule { }
