import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { validators: [Validators.required] }),
  });
  isLoading = false;
  private _loadingSubs: Subscription;

  constructor(
    private _authService: AuthService,
    private _uiService: UIService
  ) {}

  ngOnInit(): void {
    this._loadingSubs = this._uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }

  onSubmit() {
    console.log(this.loginForm);
    this._authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }

  ngOnDestroy() {
    if (this._loadingSubs) {
      this._loadingSubs.unsubscribe();
    }
  }
}
