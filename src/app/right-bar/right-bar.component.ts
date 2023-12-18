import { Component } from '@angular/core';
import { switchMap, map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent {
  currentUserUid: string;
  userToFollowId: string;
  isFollowing:boolean=false;
        constructor( public userService:UserService, private authservice:AuthenticationService){
          this.currentUserUid = '';
          this.userToFollowId = '';
        }
        ngOnInit() {
        }
        user$= this.authservice.currentUser$;

        followUser(userToFollowId: string) {
          this.user$.subscribe(user => {
            if (user) {
          this.userService.followUser(user.uid, userToFollowId)
              .then(() => console.log('User followed successfully'))
              .catch(error => console.error('Error following user: ', error));}
          });
      }

      allUsers$ = this.userService.getAllUsers().pipe(
        switchMap(users =>
          this.authservice.currentUser$.pipe(
            map(currentUser => currentUser ? users.filter(user => user['uid'] !== currentUser['uid']) : users)
          )
        )
      );
            viewProfile(accountId:string):void{
              this.userService.navigateToProfile(accountId);
            }

}
