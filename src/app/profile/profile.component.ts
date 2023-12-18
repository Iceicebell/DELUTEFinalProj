import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@angular/fire/auth';
import { ImageUploadService } from '../services/image-upload.service';
import { Observable, concatMap, switchMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from '../models/user.profile';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user$: Observable<ProfileUser | null>;
  editmode:boolean=true;
  id:string="";
  profileUser: ProfileUser | null = null;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    bio: new FormControl(''),
  })

  constructor(private authservice:AuthenticationService,
    private imageupload:ImageUploadService,
    private userService:UserService,
    private actroute:ActivatedRoute){
      this.user$ = this.userService.currentUserProfile$;
    }

  ngOnInit():void{
    this.userService.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user)=> {
      this.profileForm.patchValue({...user});
    })


    this.actroute.params.subscribe(params => {
      const profileId = params['id'];

      this.authservice.currentUser$.subscribe(currentUser => {
        if (currentUser && currentUser.uid !== profileId) {
          this.userService.getUserById(profileId).then(profileUser => {
            this.profileUser = profileUser;
            this.editmode = false; // Assuming you want to disable edit mode for other users' profiles
          });
        } else {
          // This is the current user's profile, handle accordingly
          this.editmode = true;
        }
      });
    });
  }
  uploadImage(event:any, user:ProfileUser){
    this.imageupload.uplaodImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoURL)=> {
        console.log('photoURL:', photoURL);
        return this.userService.updateUser({uid: user.uid, photoUrl: photoURL});
      })
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
