import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date = new Date();
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
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this._authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  ngOnDestroy(): void {
    if (this._loadingSubs) {
      this._loadingSubs.unsubscribe();
    }
  }
}
