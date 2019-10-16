import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Time } from '@angular/common';
import { EventsService } from 'src/app/services/events.service';
import { SessionService } from '../../auth/session.service';


interface DTO{
  title: string;
  time: string;
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
    time: "",
    date: "",
    description: "",
  }
  // events = new FormControl('');
  events;

  constructor(
    private eventsService: EventsService,
    private session: SessionService,
    private formBuilder: FormBuilder) {
      this.events = this.formBuilder.group({
        title: '',
        time: '',
        date: '',
        description:'',
      });
     }

  ngOnInit() {
  }
  //gets called when the user hits the submit key
  onSubmit(customerData){
    //Process checkout data here
    this.events.reset(); 
    this.DTO ={
      title: customerData.title,
      time: customerData.time,
      date: customerData.date,
      description:customerData.description,
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
  aSubmittedEventFunciton(){
    
  }
}