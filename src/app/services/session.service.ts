import { Injectable } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
// import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
  ) { }
  private url = 'http://localhost:3000/api/auth';
  
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('sessionToken');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);

  }
  
  getSession(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-auth-token': token
      })
    }
    return this.http.get<any>(this.url,httpOptions).pipe(
      catchError(this.handleError<any>(`userInfo`, token))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
