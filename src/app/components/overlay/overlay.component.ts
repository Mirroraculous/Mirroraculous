import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable, timer } from 'rxjs';
import { TestService} from '../../services/test.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
    ]),
    trigger('showGreeting2',[
      state('false',style({
        opacity:0,
      })),
      state('true',style({
        opacity:1,
      })),
      transition('true => false',[
        animate('.5s')
      ]),
    ]),
    trigger('showGreeting3',[
      state('false',style({
        opacity:0,
      })),
      state('true',style({
        opacity:1,
      })),
      transition('true => false',[
        animate('.5s')
      ]),
      transition('false => true',[
        animate('.5s')
      ]),
    ])
  ],
})
export class OverlayComponent implements OnInit {
  showGreeting;
  showGreeting2;
  showGreeting3;
  startTime;
  stopTime;
  remove;
  remove2;
  user;
  timer: Observable<any>;
  constructor(public dialog: MatDialogModule,
    private test: TestService) {
    this.showGreeting = true;
    this.showGreeting2 = true;
    this.showGreeting3 = false;
    this.remove = false;
   }
  onAnimationEvent ( event: AnimationEvent ) {
  }
  ngOnInit() {
    this.test.getSession().subscribe(
      val=>{
        console.log(val);
        if(val.name){          
          this.user= val.name;
        }
        else{
          this.user = '';
        }
      }
    );
    const timer2 = timer(4000);
    const timer3 = timer(6500);
    const timerLength = timer(7500);
    const timer4 = timer(8000);    
    timer2.subscribe(
      val =>{
        this.showGreeting2 = false;
        this.showGreeting3 = true;
      }
    );
    timer3.subscribe(
      val =>{
        this.showGreeting3 = false;
      }
    );
    timerLength.subscribe(
      val =>{
      this.showGreeting = false;
      }
    );
    timer4.subscribe(
      val =>{
        this.remove = true;
      }
    );
    }
}
