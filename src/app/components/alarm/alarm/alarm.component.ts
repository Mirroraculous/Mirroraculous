import { Component, OnInit } from '@angular/core';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { AlarmService} from '../../../services/alarm.service';
import { FormBuilder, FormControl } from '@angular/forms';

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
  alarmy;
  currentAdding = false;
  nowish;
  hours;
  militaryHours;
  minutes;
  seconds;
  showClockOptions = false;
  extension;
  message = '';
  military = false;
  timerId= null;
  current_alarm_string = [];
  constructor(
    private alarm: AlarmService,
    private formBuilder: FormBuilder,
  ) {
    this.alarmy = this.formBuilder.group({
      alarm: "",
    });
   }

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
    const space =this.hours+":"+this.minutes+" "+this.extension;
    const no_space =this.hours+":"+this.minutes+this.extension; 
    this.current_alarm_string.push(space);
    this.current_alarm_string.push(no_space);
    this.alarms.forEach(element => {
      if(element){
        this.current_alarm_string.forEach(elements =>{
          if(element == elements){
            this.makeNoise();
          }
        });
      }
    });
    this.current_alarm_string = [];
    
  }
  makeNoise(){
    let audio = new Audio();
    audio.src = "../../../assets/audio/alarm.wav";
    audio.load();
    audio.play();
  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }
  onSubmit(val){
    console.log("HEY LOOK AT THIS CONSOLE.LOG",val);
    this.alarm.addAlarm(val).subscribe(
      val=>{
        if (val.status!=200){
          this.message = 'Invalid alarm input'
        }
    });
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
