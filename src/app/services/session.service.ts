import { Injectable } from '@angular/core';
// import { HttpClient } from 'selenium-webdriver/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  private url = 'http://localhost:3000/api/auth';
  checkSession(){
    if(localStorage.getItem('sessionToken')!= null &&localStorage.getItem('sessionToken')!= undefined ){      
      this.getSession(localStorage.getItem('sessionToken')).subscribe(val =>{
        console.log(val.status, val)
        if (val.id!=null && val.id!=undefined){
          this.router.navigate(['/home']);          
        }
        else{
          console.log('geddout');  
          this.router.navigate(['/login']);

        }
      });
    }else{
      this.router.navigate(['/login']);
    }
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
