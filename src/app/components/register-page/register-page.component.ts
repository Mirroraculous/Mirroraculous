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
      .subscribe();
  }
}
