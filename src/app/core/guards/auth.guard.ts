import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(this.appService.getToken())
    if(this.appService.getToken()) {
      console.log("guard true", this.appService.getToken())
      return true
    }
    else {
      console.log("guard false", this.appService.getToken())
      this.router.navigate(['login'])
      return false
    }
  }
  
}
