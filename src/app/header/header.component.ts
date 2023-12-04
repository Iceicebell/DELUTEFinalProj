import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ImageUploadService } from '../services/image-upload.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ProfileUser } from '../models/user.profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user$: Observable<ProfileUser | null>;
  constructor(private authservice:AuthenticationService, private imageupload:ImageUploadService, private userService:UserService){
    this.user$ = this.userService.currentUserProfile$;
  }
  ngOnInit():void{

  }
}
