import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = "http://localhost:3000/api/calendar/";  // URL to web api

  constructor(
    private http: HttpClient) { }

  // Send event info to the backend to get called later for popup
  sendEventInfo(eventInfo){
    return this.http.post<any>(this.url, eventInfo,{observe: 'response'}).pipe(
      catchError(this.handleError<any>(`eventInfo`, eventInfo))
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