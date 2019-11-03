import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TestService} from './services/test.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mirroraculous';
  constructor(
    private router: Router,
    private testService: TestService,
  ){

  }
  ngOnInit() {
    this.testService.getSession().subscribe(
      val=>{
        console.log(val);
        if(val.body.googletoken != null){
          this.router.navigate(['/home']);
        }
      }
    );  
  }
}
