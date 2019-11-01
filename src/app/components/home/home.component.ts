import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/auth/session.service';
import { Router } from "@angular/router";
import { TestService } from 'src/app/services/test.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isClicked = false;

  constructor(
    private session: SessionService,
    private router: Router,
    private test: TestService,
    private calendar: CalendarService,
  ) { }

  ngOnInit() {
    const code = new URLSearchParams(window.location.search).get("code");
    console.log(code)
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
