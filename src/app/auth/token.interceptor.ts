import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: SessionService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let session = localStorage.getItem('sessionToken');
    if(session != undefined){      
      request = request.clone({
              headers: new HttpHeaders({
              'x-auth-token': localStorage.getItem('sessionToken')
            })      
      });
      return next.handle(request);
    }else{
      request = request.clone({
              headers: new HttpHeaders({
              'x-auth-token': ''
            })      
      });
      return next.handle(request);
    }
  }
}