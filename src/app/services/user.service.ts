import { Injectable } from '@angular/core';
import { Firestore, arrayRemove, arrayUnion, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user.profile';
import { Observable, from, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Post } from '../post.model';
import { getDatabase, onValue ,ref as dbRef} from '@angular/fire/database';
import { BookmarkPost } from '../models/bookmark.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private postRef: any;
  private db = getDatabase();


  constructor(private firestore: Firestore, private authService: AuthenticationService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
  addToBookmarks(post: Post) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const ref = doc(this.firestore, 'bookmarks', user.uid);
        setDoc(ref, { bookmarks: arrayUnion(post.id) }, { merge: true });
      }
    });
  }

  async getBookmarkedPosts() {
    const bookmarkedPosts:BookmarkPost[] = [];
  
    // Get the current user
    let user;
    this.authService.currentUser$.subscribe(async (currentUser) => {
      if (currentUser) {
        // Get the bookmarked post ids from Firestore
        const docRef = doc(this.firestore, 'bookmarks', currentUser.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const bookmarkedPostIds = docSnap.data()['bookmarks'];
    
          // Get the corresponding posts from the Realtime Database
          const db = getDatabase();
          for (const postId of bookmarkedPostIds) {
            this.postRef = dbRef(db, 'posts/' + postId);
            onValue(this.postRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                bookmarkedPosts.push(data);
              }
            });
          }
        }
      }
    });
  
    return bookmarkedPosts;
  }
  getPostData(postId: string): Observable<any> { // replace 'any' with the actual type if known
    this.postRef = dbRef(this.db, 'posts/' + postId);
    return new Observable((observer) => {
      onValue(this.postRef, (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  }

  removeFromBookmarks(post: BookmarkPost): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          const ref = doc(this.firestore, 'bookmarks', user.uid);
          console.log(`Removing post with id ${post.id} from bookmarks for user ${user.uid}`);
          updateDoc(ref, { 'bookmarks': arrayRemove(post.id) })
            .then(() => {
              console.log('Post successfully removed from bookmarks');
              resolve();
            })
            .catch(error => {
              console.error('Error removing post from bookmarks: ', error);
              reject(error);
            });
        }
      });
    });
  }
}
