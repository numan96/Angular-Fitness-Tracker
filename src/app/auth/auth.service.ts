import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();

  private _isAuthenticated: boolean = false;

  constructor(
    private _router: Router,
    private _afAuth: AngularFireAuth,
    private _trainingService: TrainingService
  ) {}

  initAuthListener() {
    this._afAuth.authState.subscribe((user) => {
      if (user) {
        this._isAuthenticated = true;
        this.authChange.next(true);
        this._router.navigate(['/training']);
      } else {
        this._trainingService.cancelSubscriptions();
        this._isAuthenticated = false;
        this.authChange.next(false);
        this._router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this._afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  login(authData: AuthData) {
    this._afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this._afAuth.signOut();
  }

  isAuth() {
    return this._isAuthenticated;
  }
}
