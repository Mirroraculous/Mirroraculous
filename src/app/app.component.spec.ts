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
import { EventsComponent } from './components/addEvents/addEvents.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from "@auth0/angular-jwt";
import { CalendarComponent } from './components/calendar/calendar.component';
import { DeleteEventComponent } from './components/delete-event/delete-event.component';
import { UpdateEventComponent } from './components/update-event/update-event.component';
import { EventComponent } from './components/event/event.component';
import { SessionService } from './auth/session.service';
import { homedir } from 'os';
import { of } from 'rxjs';
import { TestService } from './services/test.service';
import { CalendarService } from './services/calendar.service';



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
        EventsComponent,
        PageNotFoundComponent,
        CalendarComponent,
        DeleteEventComponent,
        UpdateEventComponent,
        EventComponent,
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
    const app = fixture.debugElement.componentInstance
    expect(app.DTO.name).toBe("");
    expect(app.DTO.name).toBe("");
    expect(app.DTO.name).toBe("");
    
  });
  // describe('Login Page', ()=>{
  //   let login: LoginComponent;
  //   let fixture: ComponentFixture<LoginComponent>;
  //   beforeEach(()=>{
  //     fixture = TestBed.createComponent(LoginComponent);
  //     login = fixture.debugElement.componentInstance
  //     fixture.detectChanges();
  //   });
  //   it(`should create login component`,()=>{
  //     expect(login).toBeTruthy();
  //   });
  //   it(`should have no token when logged out`,()=>{
  //     expect(localStorage.getItem('sessionToken')).toBe(null)
  //   });
  // });
  describe('Home Page',()=>{   
    let home: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    beforeEach(()=>{

      fixture = TestBed.createComponent(HomeComponent);
      home = fixture.debugElement.componentInstance
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
        '{body:null, ok:true,status:200,statusText:`ok`,type:4,url:`http://localhost:3000/api/calendar/1572214583815`}'
        ));

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
        spy = spyOn(test,'getSession').and.returnValue(of('Jerry'));
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
      expect(auth).not.toBe(undefined)
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
});