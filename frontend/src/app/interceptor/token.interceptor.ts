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
      request.headers.get('signup') ||
      request.url.indexOf('cmpe281-rcip-p1') > 0 ||
      request.headers.get('signin')
    ) {
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
