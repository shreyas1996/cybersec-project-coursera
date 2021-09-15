import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';


const routes: Routes = [
    {
        path: "",
        component: RegisterComponent
    },
    {
        path: "login",
        loadChildren: ()=> import("../login/login.module").then((m) => m.LoginModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
