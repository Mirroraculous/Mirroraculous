import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable, timer } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

// import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations:[
    trigger('showGreeting',[
      state('false',style({
        opacity:0,
      })),
      state('true',style({
        opacity:1,
      })),
      transition('true => false',[
        animate('.5s')
      ]),
    ])
  ],
})
export class OverlayComponent implements OnInit {
  // overlay: OverlayModule = new OverlayModule();
  showGreeting;
  startTime;
  stopTime;
  remove;
  remove2;
  timer: Observable<any>;
  constructor(public dialog: MatDialogModule) {
    this.showGreeting = true;
    this.remove = false;
    this.remove2 = false;
   }
  onAnimationEvent ( event: AnimationEvent ) {
    if(event.toState){
      
    }
  }
  ngOnInit() {
    const timer2 = timer(4000);
    const timerLength = timer(5000);
    timer2.subscribe(
      val =>{
        this.remove2 = true;
      }
    )
    timerLength.subscribe(
      val =>{
      this.showGreeting = false;
      }
    );
    }
}
