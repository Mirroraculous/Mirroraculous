import { TestBed, async,ComponentFixture  } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import {AuthGuard} from './auth/auth-guard.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverlayComponent } from './components/overlay/overlay.component';
// import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterPageComponent } from './components/register-page/register-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { ClockComponent } from './components/clock/clock.component';

import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AddEventComponent } from './components/add-events/add-event.component';
import { DetailsEventComponent } from './components/details-event/details-event.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from "@auth0/angular-jwt";
import { CalendarComponent } from './components/calendar/calendar.component';
import { UpdateEventComponent } from './components/update-event/update-event.component'; 
import { EventComponent } from './components/event/event.component';
import { SessionService } from './auth/session.service';
import { homedir } from 'os';
import { of } from 'rxjs';
import { TestService } from './services/test.service';
import { CalendarService } from './services/calendar.service';
import { LoginService } from './services/login.service';
import { UpdateEventService } from './services/update-event.service'
import { not } from 'rxjs/internal/util/not';
import { AddEventService } from './services/add-event.service';

import { OauthComponent } from './components/oauth/oauth.component';
import { OauthService } from './services/oauth.service';
import { LocationComponent } from './components/location/location.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OverlayComponent,
        HomeComponent,
        ClockComponent,
        LoginComponent,
        RegisterPageComponent,
        AddEventComponent,
        PageNotFoundComponent,
        CalendarComponent,
        UpdateEventComponent,
        EventComponent,
        DetailsEventComponent,
        OauthComponent,
        LocationComponent,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem("access_token");
            },
            whitelistedDomains: ["example.com"],
            blacklistedRoutes: ["example.com/examplebadroute/"],
          }
        })
      ],
      providers: [JwtHelperService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Mirroraculous'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Mirroraculous');
  });
  it(`should have a register sub page`,()=>{
    const fixture = TestBed.createComponent(RegisterPageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.DTO.name).toBe("");
    expect(app.DTO.name).toBe("");
    expect(app.DTO.name).toBe("");
    
  });
  describe('Login Page', ()=>{
    let loginService: LoginService;
    let authSpy: jasmine.Spy;
    let login: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    beforeEach(()=>{
      fixture = TestBed.createComponent(LoginComponent);
      login = fixture.debugElement.componentInstance;
      loginService = TestBed.get(LoginService);
      fixture.detectChanges();

    });
    it(`should create login component`,()=>{
      expect(login).toBeTruthy();
    });
    it(`should have no token when logged out`,()=>{
      expect(localStorage.getItem('sessionToken')).not.toBe(jasmine.any(String));
    });
    it(`should have token when logged in`,()=>{
      authSpy = spyOn(loginService, 'checkUserPassCombo').and.returnValue(of({"_id":"5da645a3115a423c2cfe11d4","status":200,
                "name":"abc","email":"abc@abc.com","password":"$2a$10$dX7yXld.8DtU99fPUKRwHewHKV707LfKp0NQ0cUIa829e3.tagYBi"}));

      let DTO={
        email: "",
        password: "",
      }
      login.aSubmittedDataFunction(DTO);
      expect(localStorage.getItem('sessionToken')).not.toBe(null);
    });
    it(`should not display error message when valid`, ()=>{
      authSpy = spyOn(loginService, 'checkUserPassCombo').and.returnValue(of({"_id":"5da645a3115a423c2cfe11d4","status":200,
                "name":"abc","email":"abc@abc.com","password":"$2a$10$dX7yXld.8DtU99fPUKRwHewHKV707LfKp0NQ0cUIa829e3.tagYBi"}));
      let DTO={
        email: "",
        password: "",
      }
      login.aSubmittedDataFunction(DTO);
      console.log(login.message);
      expect(login.message).toEqual('');
    });
    it(`should display error message when invalid`, ()=>{
      authSpy = spyOn(loginService, 'checkUserPassCombo').and.returnValue(of({"_id":"5da645a3115a423c2cfe11d4","status":404,
                "name":"abc","email":"abc@abc.com","password":"$2a$10$dX7yXld.8DtU99fPUKRwHewHKV707LfKp0NQ0cUIa829e3.tagYBi"}));
      let DTO={
        email: "",
        password: "",
      }
      login.aSubmittedDataFunction(DTO);
      console.log(login.message);
      expect(login.message).toEqual('Failed to login. Incorrect credentials');
    });
  });
  describe('Add Event', ()=>{
    let addEventService: AddEventService;
    let authSpy: jasmine.Spy;
    let addEvent: AddEventComponent;
    let fixture: ComponentFixture<AddEventComponent>;
    beforeEach(()=>{
      fixture = TestBed.createComponent(AddEventComponent);
      addEvent = fixture.debugElement.componentInstance;
      addEventService = TestBed.get(AddEventService);
      fixture.detectChanges();
    });
    it(`should create add component`,()=>{
      expect(addEvent).toBeTruthy();
    });
    it(`should not display error message when valid`, ()=>{
      authSpy = spyOn(addEventService, 'sendEventInfo').and.returnValue(of({"status":200}));
      let DTO={
        summary: "asdf",
        dateTime: "5:00 AM",
        date: "11/16/2019",
        description: "bed time"
      }
      addEvent.onSubmit(DTO);
      console.log(addEvent.message);
      expect(addEvent.message).toEqual('');
    });
    it(`should display error message when invalid`, ()=>{
      authSpy = spyOn(addEventService, 'sendEventInfo').and.returnValue(of({"status":400}));
      let DTO={
        summary: "asdf",
        dateTime: "5:00 AM",
        date: "11/16/2019",
        description: "bed time"
      }
      addEvent.onSubmit(DTO);
      console.log(addEvent.message);
      expect(addEvent.message).toEqual('You must fill summary and date/time fields.');
    });
    it(`should display error message when invalid`, ()=>{
      authSpy = spyOn(addEventService, 'sendEventInfo').and.returnValue(of({"status":500}));
      let DTO={
        summary: "asdf",
        dateTime: "5:00 AM",
        date: "11/16/2019",
        description: "bed time"
      }
      addEvent.onSubmit(DTO);
      console.log(addEvent.message);
      expect(addEvent.message).toEqual('Oops! Something went wrong, please try again.');
    });
  });
  describe('Update Event', ()=>{
    let updateEvent: UpdateEventComponent;
    let fixture: ComponentFixture<UpdateEventComponent>;
    beforeEach(()=>{
      fixture = TestBed.createComponent(UpdateEventComponent);
      updateEvent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    });
    it(`should create update component`,()=>{
      expect(updateEvent).toBeTruthy();
    });
  });
  describe('Detail Events', ()=>{
    let detailEvent: DetailsEventComponent;
    let fixture: ComponentFixture<DetailsEventComponent>;
    beforeEach(()=>{
      fixture = TestBed.createComponent(DetailsEventComponent);
      detailEvent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    });
    it(`should create details component`,()=>{
      expect(detailEvent).toBeTruthy();
    });
  });
  describe('Home Page',()=>{   
    let home: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    beforeEach(()=>{

      fixture = TestBed.createComponent(HomeComponent);
      home = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    });
    it(`should create home component`,()=>{      
      expect(home).toBeTruthy();
    });
    it(`should have no token when logged out`,()=>{
      home.logout()
      expect(localStorage.getItem('sessionToken')).toBe(null)

    });
  });
  describe('Calendar',()=>{
    let calendarService : CalendarService;
    let de: DebugElement;
    let spy: jasmine.Spy;
    let calendar:CalendarComponent;
    let fixture: ComponentFixture<CalendarComponent>;
    beforeEach(()=>{
      fixture = TestBed.createComponent(CalendarComponent);
      calendar = fixture.debugElement.componentInstance;
      calendarService = TestBed.get(CalendarService);

      spy = spyOn(calendarService,'sendEventInfo').and.returnValue(of(
        `{"userid":"5da645a3115a423c2cfe11d4","_id":"5dbe47ecb3d131960c1b73a5","status":"","htmlLink":"","created":"2019-11-03T03:22:20.538Z","updated":"0001-01-01T00:00:00Z","summary":"hi","description":"hi","location":"","colorId":"","creator":{"email":"","displayName":"","self":false},"start":{"date":"2019-11-02T06:00:00Z","dateTime":"2019-11-02T20:30:00Z","timeZone":""},"end":{"date":"0001-01-01T00:00:00Z","dateTime":"0001-01-01T00:00:00Z","timeZone":""},"endTimeUnspecified":true},{"userid":"5da645a3115a423c2cfe11d4","_id":"5dbe4803b3d131960c1b73a6","status":"","htmlLink":"","created":"2019-11-03T03:22:43.683Z","updated":"0001-01-01T00:00:00Z","summary":"a","description":"a","location":"","colorId":"","creator":{"email":"","displayName":"","self":false},"start":{"date":"2019-11-01T06:00:00Z","dateTime":"2019-11-01T20:30:00Z","timeZone":""},"end":{"date":"0001-01-01T00:00:00Z","dateTime":"0001-01-01T00:00:00Z","timeZone":""},"endTimeUnspecified":true}`));

      fixture.detectChanges();
    });
    it('should run the spy',()=>{
      expect(spy).toHaveBeenCalled();
    });
    it(`Should create Calendar`,()=>{
      expect(calendar).toBeTruthy();
    });
  });
  describe('Clock',()=>{
    let clock:ClockComponent;
    let fixture: ComponentFixture<ClockComponent>;
    beforeEach(() => {
          fixture = TestBed.createComponent(ClockComponent);
          clock = fixture.componentInstance;
          fixture.detectChanges();
        });
        it('should have military set to false',()=>{
          expect(clock.military).toBe(false);
        });
        it('should create', () => {
          expect(clock).toBeTruthy();
        });
  });
  describe('Overlay',()=>{
    let overlay:OverlayComponent;
    let fixture: ComponentFixture<OverlayComponent>;
    let test : TestService;
    let de: DebugElement;
    let service: TestService;
    let spy: jasmine.Spy;
    // beforeEach(async(()=>{
    //   let serviceStub = {
    //     getUser:() => of('Jerry'),
    //   };
    //   TestBed.configureTestingModule({
    //     declarations:[OverlayComponent],
    //     providers:[{provide:TestService,useValue:serviceStub}]
    //   })
    // }));
    beforeEach(() => {
        fixture = TestBed.createComponent(OverlayComponent);
        overlay = fixture.componentInstance;
        localStorage.removeItem('sessionToken');
        test = TestBed.get(TestService)
        spy = spyOn(test,'getSession').and.returnValue(of('{"_id":"5da645a3115a423c2cfe11d4","name":"abc","email":"abc@abc.com","password":"$2a$10$dX7yXld.8DtU99fPUKRwHewHKV707LfKp0NQ0cUIa829e3.tagYBi","googletoken":{"access_token":"ya29.Il-vB6mMSlWE2kAsXStt2FV-_umrA5a-1yMjY6rFAOonU5J_ZhFnRvQy3SvGSyOrplwUHB454QeI5uRzX4-agNsWf0RD7HxELYiFqYX1SK8ekUEHXSi0-BXwvMc30BlfMw","token_type":"Bearer","expiry":"2019-11-03T01:58:07.276Z"}}'));
        fixture.detectChanges();
      });
      it('should get a username',()=>{
        expect(spy).toHaveBeenCalled();
        overlay.getUser()
        expect(overlay.user).not.toBe(null);
      });
      it('should create', () => {
        expect(overlay).toBeTruthy();
      });
      it('should properly initialize',()=>{
        expect(overlay.showGreeting).toBe(true);
        expect(overlay.showGreeting2).toBe(true);
        expect(overlay.showGreeting3).toBe(false);
        expect(overlay.remove).toBe(false);
      });
      it('should have undefined unused variables',()=>{
        expect(overlay.remove2).toBe(undefined);
        expect(overlay.timer).toBe(undefined);
        expect(overlay.startTime).toBe(undefined);
        expect(overlay.stopTime).toBe(undefined);
      });
  });
  describe('Session Service',()=>{
    let session:SessionService;
    let fixture: ComponentFixture<SessionService>;
    beforeEach(() => {
      fixture = TestBed.get(SessionService);
      session = fixture.componentInstance;
    });    
    xit('Should be capable of determining if the session',()=>{
      let auth = session.isAuthenticated();
      console.log(auth);
      expect(auth).not.toBe(undefined);
    });
  });
  // describe('Auth Guard',()=>{
  //   let service: AuthGuard = TestBed.get(AuthGuard);

  //   it('should be created', () => {
  //         expect(service).toBeTruthy();
  //   });
  //   // it('should be functionally acceptable',()=>{
  //   //   expect(service.canActivate()).toBe(false)
  //   // });

  // });

  describe('LocationComponent', () => {
    let component: LocationComponent;
    let fixture: ComponentFixture<LocationComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ LocationComponent ]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(LocationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});