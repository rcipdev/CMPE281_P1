import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.auth.getToken();
    if (!token) this.auth.logout();
    if (
      request.url.indexOf('signup') != 0 ||
      request.url.indexOf('signin') != 0
    )
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    return next.handle(request);
  }
}
