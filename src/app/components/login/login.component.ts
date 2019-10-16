import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../auth/session.service';
import { Router } from "@angular/router";

interface DTO{
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  message = '';
  login;
  DTO: DTO={
    email: "",
    password: "",
  }
  constructor(
    private router: Router,
    private session: SessionService,
    private loginService: LoginService,
    private formBuilder: FormBuilder) {
      this.login = this.formBuilder.group({
        email: "",
        password: "",
      });
  }

  ngOnInit() {
  }
  aSubmittedDataFunction(input){
    this.DTO = {
      email:input.email,
      password:input.password,
    }
    this.loginService.checkUserPassCombo(this.DTO).subscribe(
      val => {
        console.log(val.status);
        if (val.status === 200 || val.status === 204){
          this.message = '';
          localStorage.setItem('sessionToken',val.body);
          this.router.navigate(['/home']);
        }
        else{
          this.message = 'Failed to login. Incorrect credentials';
        }
      }
    );
  }
}