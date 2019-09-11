import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  nowish;
  hours;
  minutes;
  seconds;
  extension;
  military = false;
  timerId= null;
  constructor() { }

  ngOnInit() {
    this.setTime();    
    this.timerId = this.updateTime();
  }
  private setTime(){          
    this.nowish = new Date();
    this.minutes = this.leftPadZero(this.nowish.getMinutes());
    this.seconds = this.leftPadZero(this.nowish.getSeconds());
    if(this.military){
      this.hours = this.leftPadZero(this.nowish.getHours());
    }else{
      if (this.nowish.getHours()>12){
        this.extension = "PM";
      }
      else{
        this.extension = "AM";
      }
      this.hours = this.nowish.getHours()%12;
    }
  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }
  private updateTime() {
    setInterval(() => {
      this.setTime();
    }, 1000);
  }
  private leftPadZero(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }

}
