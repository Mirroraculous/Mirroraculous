import { Injectable } from '@angular/core';
import { ErrorService} from'./error.service';
import { HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  constructor(
    private err:ErrorService,
    private http:HttpClient,
  ) { }
  addAlarm(alarm){
    const url = `http://localhost:3000/api/alarms`;
    return this.http.post<any>(url, alarm,{observe: 'response'}).pipe(
      catchError(this.err.handleError<any>(`eventInfo`, alarm))
    );
  }
}
