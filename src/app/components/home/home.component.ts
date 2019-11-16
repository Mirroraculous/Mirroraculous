import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/auth/session.service';
import { Router } from "@angular/router";
import { TestService } from 'src/app/services/test.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { GoogleAuthService } from 'src/app/services/googleauth.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isClicked = false;
  hasAuth = false;

  constructor(
    private session: SessionService,
    private router: Router,
    private test: TestService,
    private calendar: CalendarService,
    private googleauth: GoogleAuthService,
  ) { }

  ngOnInit() {
    const code = new URLSearchParams(window.location.search).get("code");
    console.log(code)
    if(code != null) {
      this.googleauth.sendCode(code).subscribe(
        val=> {
          console.log(val)
        }
      )
      this.checkAuth()
    }
    timer(5000).subscribe(
      val =>{           
        this.checkAuth();
      }
    );
  }  

  checkAuth() {
    this.test.getSession().subscribe(
      val=>{
        if(val.body.googletoken.access_token != ""){
          this.hasAuth = true;
          this.router.navigate(['/home']);
        }
      }
    );
  }
  logout(){
    localStorage.removeItem('sessionToken');
    this.router.navigate(['login']);
  }
}
