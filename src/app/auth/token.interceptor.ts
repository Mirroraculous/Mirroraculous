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
    
    request = request.clone({
            headers: new HttpHeaders({
            'x-auth-token': localStorage.getItem('sessionToken')
          })      
    });
    return next.handle(request);
  }
}