import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  nowish;
  hours;
  militaryHours;
  minutes;
  seconds;
  showClockOptions = false;
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
    this.hours =  this.leftPadZero(this.nowish.getHours()%12);
    this.militaryHours = this.leftPadZero(this.nowish.getHours());
    if (this.nowish.getHours()>12){
      this.extension = "PM";
    }
    else{
      this.extension = "AM";
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
  private updateShow(val){
    if(val=== 'clock'){
      this.showClockOptions = !this.showClockOptions;
    }
  }
  private clockChoice(val){
    if(val === 'military'){
      this.military =true;
    }else{
      this.military = false;
    }
  }
  private leftPadZero(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }

}
