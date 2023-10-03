import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    if (this.authService.getToken()) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe(
      (data) => {
        this.authService.setSession(data.access_token);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
