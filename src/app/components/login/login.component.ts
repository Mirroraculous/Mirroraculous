import { Component, OnInit } from '@angular/core';
  //import service here as well


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //import service through the constructor
  constructor() { }

  ngOnInit() {
  }
  //gets called when user hits a submit key
  aSubmittedDataFunction(){
    // put a call here to a service that posts values to the backend. Enpoint is POST "localhost:3000/api/auth"
  }

}
