import { Component, OnInit } from '@angular/core';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
interface Alarm{
  isActive: boolean;
  time: number;
}
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss']
})
export class AlarmComponent implements OnInit {
  isMinified = false;
  alarms: Alarm[] = [];
  currentAdding = false;
  nowish;
  hours;
  militaryHours;
  minutes;
  seconds;
  showClockOptions = false;
  extension;
  military = false;
  timerId= null;
  current_alarm_string;
  constructor() { }

  ngOnInit() {
    this.setTime();    
    this.timerId = this.updateTime();
  }
  private setTime(){          
    this.nowish = new Date();
    this.minutes = this.leftPadZero(this.nowish.getMinutes());
    this.seconds = this.leftPadZero(this.nowish.getSeconds());    
    this.militaryHours = this.nowish.getHours();
    // console.log(this.militaryHours);
    if((this.militaryHours%12===0 && this.militaryHours>=12)||(this.militaryHours%12===0 && this.militaryHours===0)){
      this.hours = this.militaryHours%12 +12;
    }else{      
      this.hours =  this.militaryHours%12;
    }
    if (this.militaryHours>=12){
      this.extension = "PM";
    }
    else{
      this.extension = "AM";
    }
    this.current_alarm_string.append(this.hours+":"+this.minutes+" "+this.extension);
    this.current_alarm_string.append(this.hours+":"+this.minutes+this.extension);
    this.alarms.forEach(element => {
      if(element){
        this.current_alarm_string.forEach(elements =>{
          if(element == elements){
            this.makeNoise();
          }
        });
      }
    });
    
  }
  makeNoise(){

  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }
  onSubmit(val){
    console.log("HEY LOOK AT THIS CONSOLE.LOG",val);
    //add backend call
  }
  changeAdding(){
    this.currentAdding = !this.currentAdding;
  }
  changeView (){
    this.isMinified = !this.isMinified;
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
