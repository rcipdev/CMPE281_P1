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

  generatePreSignedURL(bucketName: string, key: string): Observable<any> {
    return this.http.post(`http://localhost:3000/file/url`, {
      bucketName,
      key,
    });
  }

  putToS3(url: string, file: any): Observable<any> {
    return this.http.put(url, file);
  }

  saveFile(key: string, fileType: string, desc: string): Observable<any> {
    return this.http.post(`http://localhost:3000/file/save`, {
      key,
      fileType,
      desc,
    });
  }

  deleteFile(key: string, bucketName: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/file/delete`, {
      body: { key, bucketName },
    });
  }
}
