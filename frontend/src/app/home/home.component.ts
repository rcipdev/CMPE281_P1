import { Component } from '@angular/core';
import { FileService } from '../service/file.service';
import { DomSanitizer } from '@angular/platform-browser';
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
  uploadedFile: File | null;
  fileUpload: FormGroup;

  constructor(
    private fileService: FileService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.fileUpload = this.fb.group({
      desc: new FormControl('', Validators.required),
    });
    this.getFiles(() => {});
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

  getFiles(callback: any) {
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
        callback();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  upload() {
    if (this.fileUpload.valid && this.uploadedFile) {
      let fname = Date.now().toString() + '_' + this.uploadedFile.name;
      this.fileService.generatePreSignedURL('cmpe281-rcip-p1', fname).subscribe(
        (data: string) => {
          this.putToS3(data, () => {
            if (this.uploadedFile)
              this.saveFile(
                fname,
                this.uploadedFile.type,
                this.fileUpload.controls['desc'].value,
                () => {
                  this.getFiles(() => {
                    console.log('successfully uploaded');
                    this.fileUpload.reset();
                    this.deleteSelected;
                  });
                }
              );
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deleteSelected() {
    let files = (<HTMLInputElement>document.getElementById('file')).value;
    if (files !== null) {
      (<HTMLInputElement>document.getElementById('file')).value = '';
      this.uploadedFile = null;
    }
  }

  deleteFile(fname: string) {
    let fileInd = this.files.findIndex((fil) => {
      return fil.name == fname;
    });
    if (fileInd != -1) {
      this.fileService
        .deleteFile(this.files[fileInd].name, 'cmpe281-rcip-p1')
        .subscribe(
          () => {
            this.getFiles(() => {});
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  putToS3(url: string, callback: any) {
    const formData = new FormData();
    if (this.uploadedFile) {
      formData.append('file', this.uploadedFile);
      this.fileService.putToS3(url, formData).subscribe(
        (data) => {
          callback();
        },
        (error) => {
          console.log(error);
          throw Error(error);
        }
      );
    }
  }

  saveFile(fileName: string, fileType: string, desc: string, callback: any) {
    this.fileService.saveFile(fileName, fileType, desc).subscribe(
      (data) => {
        callback();
      },
      (error) => {
        console.log(error);
        throw Error(error);
      }
    );
  }

  rollback() {
    //
  }
}
