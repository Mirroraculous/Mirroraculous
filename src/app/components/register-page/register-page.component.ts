import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { Router } from "@angular/router";
import { FormBuilder } from '@angular/forms';



interface Account{
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  message = '';
  register;
  DTO: Account = {
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
  }

  constructor(
    private registerService: RegisterService,
    private location: Location,
    private router: Router,
    private formBuilder: FormBuilder,

  ) {
    this.register = this.formBuilder.group({
      name: "",
      password: "",
      confirmPassword: "",
      email: "",

    });
   }

  ngOnInit() {
  }

  submit(input): void {
    this.DTO = {
      name: input.name,
      password: input.password,
      confirmPassword: input.confirmPassword,
      email: input.email,
    }
    this.registerService.addUser(this.DTO)
      .subscribe(
        val =>{
          if(val.status === 200 || val.status === 204){
            this.message = '';
            console.log('successfully registered user');
            this.router.navigate(['/home']);

          }else{
            console.log(val.status);
            this.message = 'Failed to register. Likely account already exists.'
          }
        }
      );
  }
}
