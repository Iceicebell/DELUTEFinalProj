import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage:Storage) { }

  uplaodImage(image:File, path:string): Observable<string>{
    const storageref = ref(this.storage, path);
    const uploadTask =from(uploadBytes(storageref, image));
    return uploadTask.pipe(
      switchMap((result)=>getDownloadURL(result.ref))
    )
  }
}
