import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.session.checkSession();
  }  
  logout(){
    localStorage.removeItem('sessionToken');
    this.router.navigate(['login']);
  }

}
