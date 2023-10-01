import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    const { email, password, fullName } = this.loginForm.value;
    console.log(email);
  }
}
