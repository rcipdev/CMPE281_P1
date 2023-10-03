import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  @Input() flag: boolean = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  signup() {
    const { fname, lname, email, password } = this.loginForm.value;
    this.authService.signup({ fname, lname, email, password }).subscribe(
      (data) => {
        this.toastr.success('Signup Successfull!', 'Please Login!');
        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
