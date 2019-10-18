import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewSize = 7;
  valueArray;
  month;
  year;
  now = new Date();
  constructor() { }

  ngOnInit() {
    this.popViewSize();
    this.month= this.now.getMonth();
    this.year= this.now.getFullYear();
  }
  popViewSize(){
    this.valueArray = [];
    for(let i =0;i<this.viewSize; i++){
      this.valueArray.append(i);
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
    if (this.viewSize === 7){
      this.viewSize = this.getDaysInMonth(this.month,this.year);
    }else{
      this.viewSize = 7;
    }
    this.popViewSize();
  }
}
