import { Component, OnInit } from '@angular/core';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { AlarmService} from '../../../services/alarm.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';


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
  playing = false;
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
    this.getAlarm();
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
      if(element && !this.playing){
        this.current_alarm_string.forEach(elements =>{
          if(element.time == elements && element.isActive){
              this.activeLength();
              for(let i =0; i<5;i++){
                this.makeNoise();
              }
          }
        });
      }
    });
    this.current_alarm_string = [];
    
  }
  activeLength(){
    this.playing = true
    const timer4 = timer(60000);
    timer4.subscribe(val=>{
      this.playing = false;
      }
    );
  }
  makeNoise(){
    let audio = new Audio();
    audio.src = "../../../assets/audio/Alarm-Fast-A1.mp3";
    audio.load();
    audio.play();
  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }
  getAlarm(){
    this.alarm.getAlarm().subscribe(
      val=>{
        if(val.status!=200){
          this.message = 'Invalid alarm input'
        }else{
          console.log(val)
          val.body.forEach(element => {
            let new_thing: Alarm = {
              isActive: element.isActive,
              time: element.time
            }
            let exists = false;
            this.alarms.forEach(element=>{
              if (new_thing.time == element.time){
                exists = true
              }
            })
            if (!exists){
              this.alarms.push(new_thing)
            }
          });
        }
      });
  }
  onSubmit(val){
    console.log("HEY LOOK AT THIS CONSOLE.LOG",val);
    this.alarm.addAlarm(val).subscribe(
      val=>{
        if (val.status!=200){
          this.message = 'Invalid alarm input';
        }
        else{
          this.message = '';
        }
    });
  this.getAlarm();
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
