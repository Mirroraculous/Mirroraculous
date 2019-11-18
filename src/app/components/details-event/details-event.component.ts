import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details-event',
  templateUrl: './details-event.component.html',
  styleUrls: ['./details-event.component.scss']
})
export class DetailsEventComponent implements OnInit {
  constructor() { }
  @Input() day;
  ngOnInit() {
    console.log("day",this.day)
  }

}
