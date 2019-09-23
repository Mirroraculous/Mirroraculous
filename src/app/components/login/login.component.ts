import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '../../Services/login.service';
//import service here as well
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
  DTO: DTO={
    email: "",
    password: "",
  }

  // where you store form info and what you send to the backend
  //import service through the constructor
  constructor(private loginService: LoginService) { 
    
  }

  ngOnInit() {
  }
  //gets called when user hits a submit key
  aSubmittedDataFunction(){
    // console.log(this.DTO);
    this.loginService.checkUserPassCombo(this.DTO).subscribe(
      val => {
        if (val.status === 200 || val.status === 204){
          this.message = '';
          console.log(val);
        }
        else{
          this.message = 'Failed to login. Incorrect credentials';
          console.log(val);
        }
      }
    );
    //put a call here to a service that posts values to the backend. Enpoint is POST "localhost:3000/api/auth"
  }
}