import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: any

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private userService: UserService
    ) {
    this.registerForm = this.fb.group({
      emailId: this.fb.control('', 
      [Validators.required, Validators.email]),
      userName: this.fb.control('', 
      [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/)]),
      password: this.fb.control('', 
      [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])
    })
   }

  ngOnInit() {
  }

  get(param) {
    return this.registerForm.get(param).value;
  }

  register() {
    console.log(this.registerForm);
    console.log("form values", this.get("emailId"), this.get("userName"), this.get("password"));
    //api for login
    if(!this.registerForm.errors && this.registerForm.status === "VALID") {
      this.userService.register({emailId: this.get("emailId"), username: this.get("userName"), password: this.get("password")})
      .subscribe((res) => {
          //after successfull attempt navigate to login
          this.router.navigate(["login"])
        })
    }
  }

  navigateToLogin() {
    this.router.navigate(['login'])
  }

}

