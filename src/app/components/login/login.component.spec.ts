import { TestBed, async, ComponentFixture } from '@angular/core/testing';
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
import { ClockComponent } from '../../components/clock/clock.component';

import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should have full dto',()=>{
    expect(component.DTO.email.toBeUndefined());
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
