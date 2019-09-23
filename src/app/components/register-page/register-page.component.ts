import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '../../services/register.service';

interface Account{
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  message = '';
  DTO: Account = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  }

  constructor(
    private registerService: RegisterService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  submit(): void {
    this.registerService.addUser(this.DTO)
      .subscribe(
        val =>{
          if(val === 200 || val === 204){
            console.log('successfully registered user');
          }else{
            console.log('failed to register user');
            this.message = 'Failed to register. Likely account already exists.'
          }
        }
      );
  }
}
