import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { UpdateEventService } from 'src/app/services/update-event.service';
import { SessionService } from '../../auth/session.service';
import { Router } from "@angular/router";
import { CalendarComponent } from '../calendar/calendar.component';

interface DTO {
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
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {
  events;
  today;
  message = '';
  @Input() eventToUpdate;
  @Output() done: EventEmitter<any> = new EventEmitter<any>()
  // events = new FormControl('');

  constructor(
    private router: Router,
    private eventsService: UpdateEventService,
    private session: SessionService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    console.log(this.eventToUpdate)
    const localTime = new Date(this.eventToUpdate.start.dateTime)
    const hours = localTime.getHours()
    const min = localTime.getMinutes()
    console.log(localTime)
    this.events = this.formBuilder.group({
      summary: this.eventToUpdate.summary,
      dateTime: (hours > 10 ? hours : "0" + hours) + ":" + (min > 10 ? min : "0" + min),
      date: this.eventToUpdate.start.date.substring(0, 10),
      description: this.eventToUpdate.description,
    });
  }

  //gets called when the user hits the submit key
  onUpdate(userInfo) {
    //Process checkout data here
    const d = new Date(userInfo.date)
    const t = new Date(userInfo.date + " " + userInfo.dateTime)
    console.log(d.toISOString())
    console.log(t.toISOString())
    this.eventToUpdate.summary = userInfo.summary;
    this.eventToUpdate.description = userInfo.description;
    this.eventToUpdate.start.date = d.toISOString();
    this.eventToUpdate.start.dateTime = t.toISOString();
    this.eventsService.updateEvent(this.eventToUpdate).subscribe(
      val => {
        if (val.status === 200 || val.status === 204) {
          this.message = '';
        }
        else if (val.status === 400) {
          this.message = 'You must fill summary and date/time fields.';
        }
        else {
          this.message = 'Oops! Something went wrong, please try again.'
        }
        this.done.emit()
      }
    )
  }
}