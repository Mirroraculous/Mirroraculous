import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DeleteEventService } from '../../services/delete-event.service'
import { UpdateEventService } from '../../services/update-event.service'

@Component({
  selector: 'app-details-event',
  templateUrl: './details-event.component.html',
  styleUrls: ['./details-event.component.scss']
})
export class DetailsEventComponent implements OnInit {
  message;
  day;
  events;
  @Output() sentToUpdate: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private deleteService: DeleteEventService,
    private updateService: UpdateEventService,
  ) { }
  @Input() emitVal;
  ngOnInit() {
    const date = new Date();
    const year = date.getFullYear();
    this.day = this.emitVal.day;
    this.events = this.emitVal.events.filter(event => {
      return event.start.date.substring(0,10) == `${year}-${this.day.month+1}-${this.day.dayOf}`;
    });
  }

  deleteEvent(id, summary){
    this.deleteService.deleteEvent(id).subscribe(
      val => {
        if (val.status === 200 || val.status === 204){
          this.message = `${summary} deleted!`;
          console.log(this.message)
        }
        else if(val.status === 400){
          this.message = 'Something really weird happened O.o';
        }
        else{
          this.message = 'Oops! Something went wrong, please try again.'
        }
    })
    console.log(id)
  }

  formattedTime(time) {
    const localTime = new Date(time)
    const hours = localTime.getHours() 
    const min = localTime.getMinutes()
    return (hours > 10? hours:"0"+hours) + ":" + (min > 10? min:"0"+min)
  }

  updateEvent(event) {
   this.sentToUpdate.emit(event)
  }
}
