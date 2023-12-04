import { Injectable } from '@angular/core';
import { authState, Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, UserInfo } from '@angular/fire/auth';
import { Observable, concatMap, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$ = authState(this.auth);
  user$: Observable<any>;
  constructor(private auth: Auth) {
    this.user$ = new Observable();
  }

  signUp( email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  updateProfile(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not authenticated');

        return updateProfile(user, profileData);
      })
    );
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }
}
