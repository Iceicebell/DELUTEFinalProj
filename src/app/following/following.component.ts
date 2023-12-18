import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable, combineLatest, of, switchMap, tap } from 'rxjs';
import { ProfileUser } from '../models/user.profile';
import { Router } from '@angular/router';
import { BackEndService } from '../services/back-end.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent {
  user$: Observable<ProfileUser | null>;
  followingUsers$: Observable<any[]>;

  constructor(private postService:PostService,
    private router:Router,
    private backendservice:BackEndService,
    private userService:UserService,
    private cd: ChangeDetectorRef,
    private authService:AuthenticationService) {


      this.user$ = this.userService.currentUserProfile$;

      this.followingUsers$ = this.authService.currentUser$.pipe(
        switchMap(currentUser => {
          if (currentUser) {
            return this.userService.getUserData(currentUser.uid).pipe(
              switchMap(userData => {
                const followingUserObservables = (userData.following || []).map(userId => this.userService.getUserData(userId));
                return combineLatest<ProfileUser[]>(...followingUserObservables);
              })
            );
          } else {
            return of([]);
          }
        }),
        tap(data => console.log('followingUsers$: ', data))  // Add this line
      );
}
viewProfile(accountId:string):void{
  this.userService.navigateToProfile(accountId);
}

unfollowUser(userToUnfollowId: string) {
  this.authService.currentUser$.subscribe(currentUser => {
    if (currentUser) {
      this.userService.unfollowUser(currentUser.uid, userToUnfollowId)
        .then(() => console.log('User unfollowed successfully'))
        .catch(error => console.error('Error unfollowing user: ', error));
    }
  });
}
}
