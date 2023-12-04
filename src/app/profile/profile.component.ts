import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@angular/fire/auth';
import { ImageUploadService } from '../services/image-upload.service';
import { Observable, concatMap, switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from '../models/user.profile';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user$: Observable<ProfileUser | null>;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    bio: new FormControl(''),
  })

  constructor(private authservice:AuthenticationService, 
    private imageupload:ImageUploadService,
    private userService:UserService){
      this.user$ = this.userService.currentUserProfile$;
    }

  ngOnInit():void{
    this.userService.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user)=> {
      this.profileForm.patchValue({...user});
    })
  }
  uploadImage(event:any, user:ProfileUser){
    this.imageupload.uplaodImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoURL)=> this.userService.updateUser({uid: user.uid, photoUrl: photoURL})
      )
    )
    .subscribe({
      next: () => alert('Image uploaded successfully'),
      error: () => alert('There was an error in uploading the image')
    });
}


saveProfile(){
  const { uid, ...data } = this.profileForm.value;

  if (!uid) {
    return;
  }

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v != null)
  );

  this.userService
    .updateUser({ uid, ...filteredData })
    .subscribe({
      next: () => alert('Profile updated successfully'),
      error: () => alert('There was an error in updating the profile')
    });
}
}