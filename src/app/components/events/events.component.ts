import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Time } from '@angular/common';
import { EventsService } from 'src/app/services/events.service';

interface DTO{
  title: string;
  date: string;
  description: string;
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
    title: "",
    date: "",
    description: "",
  }

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
  }
  //gets called when the user hits the submit key
  aSubmittedEventFunciton(){
    this.eventsService.sendEventInfo(this.DTO).subscribe(
      val => {
        if (val.status === 200 || val.status === 204){
          this.message = '';
          console.log(val);
        }
        else{
          this.message = 'Failed to login. Incorrect credentials';
          console.log(val);
        }
      }
    )
  }
}