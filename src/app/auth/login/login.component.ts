import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { validators: [Validators.required] }),
  });
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.loginForm);
    this._authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}
