import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DeleteEventService } from '../../services/delete-event.service'
import { UpdateEventService } from '../../services/update-event.service'
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-details-event',
  templateUrl: './details-event.component.html',
  styleUrls: ['./details-event.component.scss']
})
export class DetailsEventComponent implements OnInit {
  message;
  day;
  events;
  @Output() refreshMe: EventEmitter<any> = new EventEmitter<any>();
  @Output() sentToUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() emitVal;
  constructor(
    private deleteService: DeleteEventService,
    private updateService: UpdateEventService,
    private calendar: CalendarService,
  ) { }
  ngOnInit() {
    const date = new Date();
    const year = date.getFullYear();
    this.day = this.emitVal.day;
    console.log(this.day)

    this.calendar.sendEventInfo(this.emitVal.searchTime).subscribe(
      val => {

        console.log(val)
        this.events = val.body.filter(event => {
          return event.start.date.substring(0, 10) == `${year}-${this.day.month + 1}-${this.day.dayOf}`;
        });
      }
    )
  }

  deleteEvent(id, summary) {
    this.deleteService.deleteEvent(id).subscribe(
      val => {
        if (val.status === 200 || val.status === 204) {
          this.message = `${summary} deleted!`;
          console.log(this.message)
        }
        else if (val.status === 400) {
          this.message = 'Something really weird happened O.o';
        }
        else {
          this.message = 'Oops! Something went wrong, please try again.'
        }
        this.refreshMe.emit(true);
      });
    console.log(id)
    this.ngOnInit()
  }

  formattedTime(time) {
    const localTime = new Date(time)
    const hours = localTime.getHours()
    const min = localTime.getMinutes()
    return (hours > 10 ? hours : "0" + hours) + ":" + (min > 10 ? min : "0" + min)
  }

  eventColor(event) {
    return event.colorId.length > 0
  }

  updateEvent(event) {
    this.sentToUpdate.emit(event)
  }
}
