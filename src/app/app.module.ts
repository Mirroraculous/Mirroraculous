import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

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
import { AddEventComponent } from './components/add-events/add-event.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from "@auth0/angular-jwt";
import { CalendarComponent } from './components/calendar/calendar.component';
import { EventComponent } from './components/event/event.component';
import { DetailsEventComponent } from './components/details-event/details-event.component';
import { UpdateEventComponent } from './components/update-event/update-event.component';
import { OauthComponent } from './components/oauth/oauth.component'




@NgModule({
  declarations: [
    AppComponent,
    OverlayComponent,
    HomeComponent,
    ClockComponent,
    OauthComponent,
    LoginComponent,
    RegisterPageComponent,
    AddEventComponent,
    PageNotFoundComponent,
    CalendarComponent,
    EventComponent,
    DetailsEventComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
