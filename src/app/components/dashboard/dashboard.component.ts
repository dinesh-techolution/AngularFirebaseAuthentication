import { Component, OnInit } from '@angular/core';
import { NgAuthService } from "../../ng-auth.service";
import { FileUploadService } from '../../file-upload.service';
import { FileUpload } from '../../file-upload.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
test:String = "12"
  constructor(public ngAuthService: NgAuthService, private uploadService: FileUploadService) { 
  }

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;

 

  ngOnInit(): void {
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }

}
