import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GoogleAuthService {
  constructor(
    private http: HttpClient,
  ) { }
  sendCode(code){
    let url =  `http://localhost:3000/api/googleauth?code=`+ code;
    return this.http.get<any>(url,{observe: 'response'}).pipe(
      catchError(this.handleError<any>(`Google auth code`))
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
