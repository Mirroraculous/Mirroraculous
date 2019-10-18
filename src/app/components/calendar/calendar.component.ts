import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  isMonth = false;
  viewArray;
  monthArray = [];
  weekArray = [];
  month;
  year;
  now = new Date();
  constructor() { }

  ngOnInit() {
    this.month= this.now.getMonth();
    this.year= this.now.getFullYear();
    console.log(this.now.getDay());
    for(let i = 0;i<this.getDaysInMonth(this.month,this.year);i++){
      this.monthArray.push(i);
    }
    for(let i = 0;i<7;i++){
      this.weekArray.push(i);
    }
    this.viewArray = this.weekArray;
    this.getFirstDayWeek(this.getFirstDayMonth());

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
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };
  changeView (){
    this.isMonth = !this.isMonth;
    if(this.isMonth){
      this.viewArray = this.monthArray;
    }else{
      this.viewArray = this.weekArray;
    }
  }
}
