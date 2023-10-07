import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class FileService {
  constructor(public http: HttpClient, public router: Router) {}

  getFiles(): Observable<any> {
    return this.http.get(`http://localhost:3000/file`);
  }
}
