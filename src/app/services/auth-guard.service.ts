import { SessionService } from './session.service';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, of} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private _authService: SessionService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(localStorage.getItem('sessionToken')!= null &&localStorage.getItem('sessionToken')!= undefined ){      
      this._authService.getSession(localStorage.getItem('sessionToken')).subscribe(val =>{
        console.log(val.status, val)
        if (val.id!=null && val.id!=undefined){
          return true;    
        }
        else{
          console.log('geddout');  
          // this.router.navigate(['/login']);
          return false;

        }
      });
    }else{
      console.log('thinks theres no session token');
      // this.router.navigate(['/login']);
      return false;
    }
  }
}