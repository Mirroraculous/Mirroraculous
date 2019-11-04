import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { EventsService } from 'src/app/services/add-event.service';
import { SessionService } from '../../auth/session.service';
import { Router } from "@angular/router";
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
    private eventsService: EventsService,
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
    this.changeVal(2);
    console.log(this.today);
  }
  onSubmit(userInfo){
    //Process checkout data here
    const d = new Date(userInfo.date)
    const t = new Date(userInfo.date + " " + userInfo.dateTime)
    console.log(d.toISOString())
    console.log(t.toISOString())
    this.events.reset(); 
    this.DTO ={
      summary: userInfo.summary,
      description: userInfo.description,
      start: {
        date: d.toISOString(),
        dateTime: t.toISOString(),
      },
      end: {
        date: null,
        dateTime: null,
      },
      endTimeUnspecified: true,
    }
    this.eventsService.sendEventInfo(this.DTO).subscribe(
      val => {
        if (val.status === 200 || val.status === 204){
          this.message = '';
          console.log(val);
        }
        else{
          this.message = 'You must fill all fields.';
          console.log(val);
        }
      }
    )
  }
}
