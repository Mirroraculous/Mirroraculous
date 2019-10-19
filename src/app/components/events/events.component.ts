import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { EventsService } from 'src/app/services/events.service';
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
  endTimeUnspecified: bool;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
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
  // events = new FormControl('');
  events;

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
  //gets called when the user hits the submit key
  onSubmit(customerData){
    //Process checkout data here
    const d = new Date(customerData.date)
    const t = new Date(customerData.date + " " + customerData.dateTime)
    console.log(d.toISOString())
    console.log(t.toISOString())
    this.events.reset(); 
    this.DTO ={
      summary: customerData.summary,
      description:customerData.description,
      start: {
        date: d,
        dateTime: t,
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

  onCancel(){
    this.router.navigate(['/home']);
  }
}