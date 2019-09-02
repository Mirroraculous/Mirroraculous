import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

// import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  // overlay: OverlayModule = new OverlayModule();
  constructor(public dialog: MatDialogModule) { }

  ngOnInit() {

  }
  dialogCreator(){
    let dialogRef= this.dialog.open()
  }
}
