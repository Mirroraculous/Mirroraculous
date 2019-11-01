import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../services/googleauth.service';

@Component({
  selector: 'app-googleauth',
  templateUrl: './googleauth.component.html'
})

export class GoogleAuthComponent implements OnInit {
  constructor(
    
    private serv: GoogleAuthService,
  ) {}

  ngOnInit() {
    const code = new URLSearchParams(window.location.search).get("code");
    console.log(code)
    this.serv.sendCode(code).subscribe(
      val => {
        console.log(val);
      }
    );
  }
}