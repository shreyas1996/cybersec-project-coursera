import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './core/services/app.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  loggedIn: boolean;

  constructor(
    private router: Router,
    private appService: AppService,
    private userService: UserService
    ) {
      console.log("ap component")
    // this.router.navigate(['home', this.appService.getUserName()])
    this.userService.isLoggedIn().subscribe(l => {
      this.loggedIn = l;
      if(this.loggedIn) {
        this.router.navigate(["home"])
      }
    })
  }
}
