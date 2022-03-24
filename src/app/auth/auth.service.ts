import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();

  private _isAuthenticated: boolean = false;

  constructor(
    private _router: Router,
    private _afAuth: AngularFireAuth,
    private _trainingService: TrainingService,
    private _uiService: UIService
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
    this._uiService.loadingStateChanged.next(true);
    this._afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this._uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        this._uiService.loadingStateChanged.next(false);

        this._uiService.showSnackbar(err.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this._uiService.loadingStateChanged.next(true);
    this._afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this._uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        this._uiService.loadingStateChanged.next(false);
        this._uiService.showSnackbar(err.message, null, 3000);
      });
  }

  logout() {
    this._afAuth.signOut();
  }

  isAuth() {
    return this._isAuthenticated;
  }
}
