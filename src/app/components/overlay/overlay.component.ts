import { Component, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  overlay: OverlayModule;
  constructor() { }

  ngOnInit() {
  }
  createOverlay(){
    this.overlay
  }
}
