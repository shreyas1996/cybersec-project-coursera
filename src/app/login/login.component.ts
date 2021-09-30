import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../core/services/app.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
    private appService: AppService
    ) {
    this.loginForm = this.fb.group({
      userName: this.fb.control('', 
      [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/)]),
      password: this.fb.control('', 
      [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])
    })
   }

  ngOnInit() {
  }

  get(param) {
    return this.loginForm.get(param).value;
  }

  login() {
    console.log(this.loginForm);
    console.log("form values", this.get("userName"), this.get("password"));
    //api for login
    if(!this.loginForm.errors && this.loginForm.status === "VALID") {
      this.userService.login({username: this.get("userName"), password: this.get("password")})
      .subscribe((res) => {
          //after successfull attempt store the cred and navigate to login
          this.appService.setUserInfo({token: res.token, username: res.user});

          this.router.navigate(["home"])
        })
    }
  }

  navigateToRegister() {
    this.router.navigate(['register'])
  }

}
