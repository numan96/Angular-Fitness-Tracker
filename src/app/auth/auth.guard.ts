import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authService.isAuth()) {
      return true;
    } else {
      return this._router.navigate(['/login']);
    }
  }

  canLoad(route: Route) {
    if (this._authService.isAuth()) {
      return true;
    } else {
      return this._router.navigate(['/login']);
    }
  }
}
