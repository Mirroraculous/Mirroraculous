import { SessionService } from './session.service';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, of} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private _authService: SessionService, private _router: Router) {
  }

  canActivate(): boolean {
    if (!this._authService.isAuthenticated()) {
      this._router.navigate(['login']);
      return false;
    }
    return true;
  }
}