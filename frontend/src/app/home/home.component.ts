import { Component } from '@angular/core';
import { FileService } from '../service/file.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { FileObject } from '../interface/file.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  gridColumns = 5;
  files: FileObject[] = [];
  uploadedFile: File;
  fileUpload: FormGroup;

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.fileUpload = this.fb.group({
      desc: new FormControl('', Validators.required),
    });
    this.fileService.getFiles().subscribe(
      (data: FileObject[]) => {
        this.files = data;
        this.files.forEach((file) => {
          const arr = new Uint8Array(file.fileData.data);
          const STRING_CHAR = arr.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);
          file.fileData.blob = this.domSanitizer.bypassSecurityTrustUrl(
            `data:${file.fileData.type};base64, ` + base64String
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploadedFile = file;
    }
  }

  onFileDragged(file: any) {
    if (file) {
      this.uploadedFile = file;
    }
  }
}
