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
          // this._router.navigate(['/home']);
          console.log('hi');
          return true;
          
        }
        else{
          console.log('geddout');

          return false;

        }
      });
    }else{
      console.log('getting to false');
      return false;
    }
  }
}