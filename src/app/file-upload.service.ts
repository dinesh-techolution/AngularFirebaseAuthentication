import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import {FirebaseApp} from '@angular/fire';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from './file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  //Hard coding for test
private basePath = '/user/GVolX9r61sd0xGdvL6FtHX1rwBg2/resume/';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage,private app: FirebaseApp)  { }

  pushFileToStorage(fileUpload: FileUpload): Observable<number> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    // const storageRef = this.app.storage("gs://delete210").ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
// const storageRef = this.storage.ref(filePath);
// const storageRef = this.storage.storage.app.storage("gs://delete210").ref(filePath);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        
        storageRef.getDownloadURL().subscribe(downloadURL => {
        // storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  getFiles(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
