import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();

  private user: User | null;

  constructor(private _router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authSuccessful();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
    };
    this.authSuccessful();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this._router.navigate(['/login']);
  }

  getUser() {
    return {
      ...this.user,
    };
  }

  isAuth() {
    return this.user != null;
  }

  private authSuccessful() {
    this.authChange.next(true);
    this._router.navigate(['/training']);
  }
}
