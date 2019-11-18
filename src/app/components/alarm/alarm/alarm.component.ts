import { Component, OnInit } from '@angular/core';
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
  constructor() { }

  ngOnInit() {
  }
  changeAdding(){
    this.currentAdding = !this.currentAdding;
  }
  changeView (){
    this.isMinified = !this.isMinified;
  }
}
