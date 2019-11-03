import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
  ) { }
  private url = 'http://localhost:3000/api/auth';

  getSession() {
<<<<<<< HEAD
    return this.http.get<any>(this.url, {observe: 'response'}).pipe(
=======
    return this.http.get<any>(this.url,{observe:'response'}).pipe(
>>>>>>> master
      catchError(this.handleError<any>(`userInfo`))
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
