import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { cred } from '../environment/dev.envvironment';

@Injectable()
export class AuthService {
  constructor(public http: HttpClient, public router: Router) {}

  login(credentials: any): Observable<any> {
    const user = {
      email: credentials.email,
      password: credentials.password,
    };
    return this.http.post(`${cred.backendURL}auth/signin`, user);
  }

  signup(credentials: any): Observable<any> {
    const user = {
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.fname,
      lastName: credentials.lname,
    };
    return this.http.post(`${cred.backendURL}auth/signup`, { ...user });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  setSession(token: string): void {
    localStorage.setItem('token', token);
    this.router.navigate(['home']);
  }

  getToken(): String | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) < expiry;
  }
}
