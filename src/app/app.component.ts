import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mirroraculous';
  registerLoginHome = 0;
  setVal(val){
    this.registerLoginHome = val;
  }
}
