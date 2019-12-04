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
  paused = false;
  current_alarm_string = [];
  audio = new Audio();
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
                this.makeNoise(this.makeAudioChoice(0));
                this.playAlarm();
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
  pauseAlarm(){
    console.log('happens')
    this.audio.pause();
    console.log(this.audio.src)
    this.paused = true;
  }
  updateItem(item){
    this.alarm.updateAlarm({"alarm":item.time}).subscribe(
      val =>{
        if(val.status!=200){
          this.message = 'Failed to update alarm';
        }
        else{
          this.message = '';
        }
      }
    )
  }
  makeAudioChoice(val){
    switch (val) {
      case 0:
          return"../../../assets/audio/Alarm-Fast-A1.mp3"
        break;
    
      default:
        return '../../../assets/audio/Alarm-Fast-High-Pitch-A3.mp3'
        break;
    }
  }
  deleteAlarm(item){
    console.log('does this activate?');
    this.alarm.deleteAlarm(item.time).subscribe(
      val =>{
        if(val.status!=200){
          console.log(val.status);
          this.message = 'Failed to update alarm';
          console.log('hi');
        }
        else{
          console.log('hi2');
          this.message = '';
          console.log('enter the lions den')
          this.alarms = this.alarms.filter(val=>{
            if (val!=item){
              return val
            }
          });
          console.log('alarms',this.alarms)
        }
      });
    console.log('hi3');
    
  }
  makeNoise(src){
    this.audio.src = src;
    this.audio.load();
    this.audio.loop = true;
    this.audio.volume = .1;
  }
  playAlarm(){
    this.audio.play();
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
