import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { AddEventService } from 'src/app/services/add-event.service';
import { SessionService } from '../../auth/session.service';
import { Router } from "@angular/router";
import { timer } from 'rxjs';

interface DTO{
  summary: string;
  description: string;
  start: {
    date: string;
    dateTime: string;
  }
  end: {
    date: string;
    dateTime: string;
  }
  endTimeUnspecified: boolean;
}
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {
  event;
  switchVal = 1;
  events;
  today;
  isFilled = false;
  clicked = false;
  message = '';
  DTO: DTO={
    summary: "",
    description: "",
    start: {
      date: "",
      dateTime: "",
    },
    end: {
      date: "",
      dateTime: "",
    },
    endTimeUnspecified: true,
  }
  constructor(
    private router: Router,
    private eventsService: AddEventService,
    private session: SessionService,
    private formBuilder: FormBuilder) {
      this.events = this.formBuilder.group({
        summary: '',
        dateTime: '',
        date: '',
        description:'',
      });
     }

  ngOnInit() {
  }
  changeVal(val){
    this.switchVal = val;
  }
  setInfo(info){
    this.today = info;
    this.changeVal(3);
    console.log('the today val',this.today);
  }
  setEvent(event) {
    this.event = event;
    console.log(this.event)
    this.changeVal(4);    
  }
  refresh(event){
    console.log("refresh happens")
    
    timer(1000).subscribe(
      val =>{
        this.changeVal(10);        
        timer(1000).subscribe(
          val =>{
            this.changeVal(3);
          }
        );
      }
    );

  }
}
