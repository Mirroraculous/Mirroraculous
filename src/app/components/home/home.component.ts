import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/auth/session.service';
import { Router } from "@angular/router";
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private session: SessionService,
    private router: Router,
    private test: TestService,
  ) { }

  ngOnInit() {
    this.test.getSession().subscribe(
      val=>{
        console.log('sucessfully added a header token w/o specificying it')
      }
    );
  }  
  logout(){
    localStorage.removeItem('sessionToken');
    this.router.navigate(['login']);
  }
}
