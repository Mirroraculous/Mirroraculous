import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  isMonth = false;
  viewArray;
  monthArray;
  weekArray;
  month;
  year;
  now = new Date();
  constructor() { }

  ngOnInit() {
    this.month= this.now.getMonth();
    this.year= this.now.getFullYear();
    for(let i = 0;i<this.getDaysInMonth(this.month,this.year);i++){
      this.monthArray.append(i);
    }
    for(let i = 0;i<7;i++){
      this.weekArray.append(i);
    }
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
