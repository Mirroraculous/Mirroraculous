import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class LoginService {

  private url = "localhost:3000/api/auth";  // URL to web api

  constructor(
    private http: HttpClient) { }


  /** GET email and pass combo. Will 404 if id not found */
  checkUserPassCombo(userPassCombo) {
    return this.http.get<any>(this.url, userPassCombo).pipe(
      catchError(this.handleError<any>(`userPassCombo`, userPassCombo))
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