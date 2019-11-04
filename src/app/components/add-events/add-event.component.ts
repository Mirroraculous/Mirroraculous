import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { AddEventService } from 'src/app/services/add-event.service';
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
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  events;
  today;
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
  // events = new FormControl('');

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

  //gets called when the user hits the submit key
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