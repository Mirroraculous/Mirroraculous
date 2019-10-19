import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
interface Day{
  isToday: boolean;
  dayOf: string;
  isEvents: boolean;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  isMonth = true;
  viewArray;
  monthArray:Day[][] = [];
  monthArrayUnorganized :Day[] = [];
  weekArray :Day[]= [];
  month;
  year;
  startDay;
  startMonth;
  now = new Date();
  constructor(
    private calendar: CalendarService
  ) { }

  ngOnInit() {
    this.month= this.now.getMonth();
    this.year= this.now.getFullYear();
    this.startDay = this.getFirstDayWeek(this.now);
    this.startMonth = this.getFirstDayWeek(this.getFirstDayMonth());  
    // this.startMonth = this.getFirstDayWeek(new Date(1551398400));  
    // console.log(this.getDaysInMonth(1, 2020));
    for(let i = this.startMonth.getDate();i<this.startMonth.getDate()+35;i++){
      let isFirstMonth = Math.floor(i/(this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear())))===0;
      let day;
      if(isFirstMonth){
        day = {
          isToday: this.now.getDate() === i? true:false,
          dayOf: String(i%(this.getDaysInMonth(this.startMonth.getMonth(),this.startMonth.getFullYear()))),
          isEvents:  false,
        }        
      }
      else if(i/(this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear()))===1){
        day = {
          isToday: this.now.getDate() === i? true:false,
          dayOf: String(i),
          isEvents:  false,
        } 
      }else{
        day= {
          isToday: this.now.getDate() === i? true:false,
          dayOf: String(i%(this.getDaysInMonth(this.now.getMonth(),this.now.getFullYear()))+1),
          isEvents:  false,
        } 
      }
      this.monthArrayUnorganized.push(day);
    }
    for(let i =0 ;i<5;i++){
      let locale: Day[] = []
      for(let k = 0;k<7;k++){
        locale.push(this.monthArrayUnorganized[i*k]);
      }
      this.monthArray.push(locale);
    }

    for(let i = this.startDay.getDate();i<this.startDay.getDate()+7;i++){
      let day:Day = {
        isToday: this.now.getDate() === i? true:false,
        dayOf: String(i),
        isEvents:  false,
      }
      this.weekArray.push(day);
    }
    this.viewArray = this.monthArray;
    this.getFirstDayWeek(this.getFirstDayMonth());
    this.calendar.sendEventInfo(this.getFirstDayWeek(this.getFirstDayMonth()).getTime()).subscribe(
      val=>{
        console.log(val);
      }
    );

  }

  getFirstDayMonth(){
    let d = new Date();
    d.setDate(d.getDate()-d.getDate()+1);
    console.log(d);
    return d;
  }

  getFirstDayWeek(today){
    let d = today;
    d.setDate(d.getDate()-today.getDay());
    console.log(d);
    return d;
  }

  getDaysInMonth(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month+1, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  }

  changeView (){
    this.isMonth = !this.isMonth;
    if(this.isMonth){
      this.viewArray = this.monthArray;
    }else{
      this.viewArray = this.weekArray;
    }
  }
}
