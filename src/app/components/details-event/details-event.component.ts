import { Component, OnInit, Input } from '@angular/core';
import { DeleteEventService } from '../../services/delete-event.service'

@Component({
  selector: 'app-details-event',
  templateUrl: './details-event.component.html',
  styleUrls: ['./details-event.component.scss']
})
export class DetailsEventComponent implements OnInit {
  message;
  day;
  events;

  constructor(
    private deleteService: DeleteEventService
  ) { }
  @Input() emitVal;
  ngOnInit() {
    this.day = this.emitVal.day;
    this.events = this.emitVal.events;
    console.log("day",this.day);
    console.log("event",this.events);
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
}
