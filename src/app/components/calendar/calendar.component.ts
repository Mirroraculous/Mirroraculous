import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { Router } from "@angular/router";

interface Day {
  isToday: boolean;
  dayOf: number;
  isEvents: boolean;
  month: number;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  listOfEvents;
  isClicked = false;
  isMonth = true;
  viewArray;
  monthArray: Day[][] = [];
  monthArrayUnorganized: Day[] = [];
  weekArray: Day[] = [];
  month;
  year;
  startDay;
  startMonth;
  displayMonth;
  @Output() onCalendarClick: EventEmitter<any> = new EventEmitter<any>();

  now = new Date();
  constructor(
    private calendar: CalendarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.month= this.now.getMonth();
    this.year= this.now.getFullYear();
    this.displayMonth = new Date(this.year,this.month+1, 0).toLocaleString('default',{month:'long'})
    this.displayNumbers();
    const rn = new Date()

    for (let i = 0; i < 5; i++) {
      let locale: Day[] = []
      for (let k = 0; k < 7; k++) {
        locale.push(this.monthArrayUnorganized[i * 7 + k]);
      }
      this.monthArray.push(locale);
    }

    this.viewArray = this.monthArray;
    console.log('startDay', this.startDay.getDate())
    for (let i = this.startDay.getDate(); i < this.startDay.getDate() + 7; i++) {
      let day: Day = {
        isToday: rn.getDate() === i ? true : false,
        dayOf: i,
        isEvents: false,
        month: rn.getMonth(),
      }
      this.weekArray.push(day);
    }
    this.getFirstDayWeek(this.getFirstDayMonth());
    this.populateEvents();

  }
  displayNumbers() {
    this.startDay = this.getFirstDayWeek(this.now);
    this.startMonth = this.getFirstDayWeek(this.getFirstDayMonth());
    const rn = new Date()
    console.log(this.startMonth.getDate())
    for (let i = this.startMonth.getDate(); i < this.startMonth.getDate() + 35; i++) {
      let isFirstMonth = Math.floor(i / (this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear()))) === 0;
      let day;
      if (isFirstMonth) {
        day = {
          isToday: rn.getDate() === i % (this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear())) + 1 ? true : false,
          dayOf: i % (this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear())),
          isEvents: false,
          month: this.startDay.getMonth()== this.startMonth.getMonth()?rn.getMonth():rn.getMonth()-1,
        }
      }
      else if (i / (this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear())) === 1) {
        console.log('does this ever happen')
        day = {
          isToday: rn.getDate() === i ? true : false,
          dayOf: i,
          isEvents:  false,
          month: this.startDay.getMonth()== this.startMonth.getMonth()?rn.getMonth():rn.getMonth()-1,
        } 
      }else{
        if(Math.floor(i/(this.getDaysInMonth(this.startMonth.getMonth(), this.startMonth.getFullYear())))===2){

          day = {
            isToday: rn.getDate() === i % (this.getDaysInMonth(rn.getMonth(), rn.getFullYear())) + 1 ? true : false,
            dayOf: i % (this.getDaysInMonth(this.now.getMonth(), this.now.getFullYear())) + 1,
            isEvents: false,
            month: this.startDay.getMonth()== this.startMonth.getMonth()?(rn.getMonth()+2)%12:rn.getMonth()+1,
          }
        }
        else {
          day = {
            isToday: rn.getDate() === i % (this.getDaysInMonth(this.startMonth.getMonth(), this.now.getFullYear())) ? true : false,
            dayOf: i % (this.getDaysInMonth(this.startMonth.getMonth(), this.now.getFullYear())),
            isEvents: false,
            month: this.startDay.getMonth()== this.startMonth.getMonth()?(rn.getMonth()+1)%12:rn.getMonth(),

          }
        }
      }
      this.monthArrayUnorganized.push(day);
    }
  }
  populateEvents() {
    this.calendar.sendEventInfo(this.getFirstDayWeek(this.getFirstDayMonth()).getTime()).subscribe(
      val => {
        if (val.body != null) {
          this.listOfEvents = val.body
          let days: Date[];
          for (let i = 0; i < val.body.length; i++) {
            let day = new Date(val.body[i].start.date);
            console.log('2');
            for (let j = 0; j < 5; j++) {
                let locale: Day[] = []
              for (let k = 0; k < 7; k++) {
                if (day.getDate() === this.monthArray[j][k].dayOf && day.getMonth() === this.monthArray[j][k].month) {
                  this.monthArray[j][k].isEvents = true;
                }
              }
              this.monthArray.push(locale);
            }
            for (let b = 0; b < 7; b++) {
              let locale: Day[] = []
              for (let k = 0; k < 7; k++) {
                if (day.getDate() === this.weekArray[b].dayOf && day.getMonth() === this.weekArray[b].month) {
                  this.weekArray[b].isEvents = true;
                }
              }
              this.monthArray.push(locale);
            }
          }
        }
      }
    );
  }
  getFirstDayMonth() {
    let d = new Date();
    d.setDate(1);
    return d;
  }

  getFirstDayWeek(today) {
    let d = today;
    d.setDate(d.getDate() - today.getDay());
    return d;
  }
  clickEvent(val) {
    this.onCalendarClick.emit({ day: val, events: this.listOfEvents, searchTime: this.getFirstDayWeek(this.getFirstDayMonth()).getTime() });
  }
  getDaysInMonth(month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month + 1, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
  }

  changeView() {
    this.isMonth = !this.isMonth;
    if (this.isMonth) {
      this.viewArray = this.monthArray;
    } else {
      this.viewArray = this.weekArray;
    }
  }
}
