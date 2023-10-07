import { Component } from '@angular/core';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  gridColumns = 5;
  files = [];
  constructor(private fileService: FileService) {
    this.fileService.getFiles().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
