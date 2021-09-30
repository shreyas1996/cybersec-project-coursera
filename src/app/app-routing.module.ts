import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';


const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: AppComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "index.html",
    pathMatch: "full",
    component: AppComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: "**",
  //   redirectTo: "login",
  //   canActivate: [AuthGuard]
  // },
  {
    path: "login",
    loadChildren: ()=> import("./login/login.module").then((m) => m.LoginModule)
  },
  {
    path: "register",
    loadChildren: ()=> import("./register/register.module").then((m) => m.RegisterModule)
  },
  {
    path: "home",
    loadChildren: ()=> import("./home/home.module").then((m) => m.HomeModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
