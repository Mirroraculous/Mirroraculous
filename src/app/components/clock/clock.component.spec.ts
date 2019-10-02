import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockComponent } from './clock.component';
// import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../app.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRoutingModule } from '../../app-routing.module';
// import { AppComponent } from './app.component';
import { OverlayComponent } from '../../components/overlay/overlay.component';
// import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterPageComponent } from '../../components/register-page/register-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '../../components/home/home.component';
// import { ClockComponent } from '../../components/clock/clock.component';

import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from '../../components/login/login.component';
import { HttpClientModule } from '@angular/common/http';

describe('ClockComponent', () => {
  let component: ClockComponent;
  let fixture: ComponentFixture<ClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OverlayComponent,
        HomeComponent,
        ClockComponent,
        LoginComponent,
        RegisterPageComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatIconModule,
        HttpClientModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  //nowish;
  // hours;
  // militaryHours;
  // minutes;
  // seconds;
  // showClockOptions = false;
  // extension;
  // military = false;
  // timerId= null;
  it('check init values',()=>{
    expect(component.military).toBe(false);
    // expect(component.nowish).toBe(undefined);
    // expect(component.hours).toBe(undefined);
    // expect(component.militaryHours).toBe(undefined);
    // expect(component.minutes).toBe(undefined);
    // expect(component.seconds).toBe(undefined);
    // expect(component.showClockOptions).toBe(false);
    // expect(component.extension).toBe(undefined);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
