import { Injectable } from '@angular/core';
import { Firestore, arrayRemove, arrayUnion, collection, doc, docData, getDoc, getDocs, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user.profile';
import { BehaviorSubject, Observable, Subject, concatMap, from, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Post } from '../post.model';
import { getDatabase, onValue ,ref as dbRef} from '@angular/fire/database';
import { BookmarkPost } from '../models/bookmark.model';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import { BackEndService } from './back-end.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private postRef: any;
  private db = getDatabase();
  private dab = getFirestore();
  private following: any;
  followingChanged = new Subject<void>();

  constructor(private firestore: Firestore,
    private authService: AuthenticationService,
    private router:Router,
    private postService:PostService,
    private backendservice:BackEndService) {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        const ref = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          this.following = docSnap.data()['following'];
        }
      }
    });
  }

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
    const update$ = from(updateDoc(ref, { ...user }));

    return update$.pipe(
      concatMap(() => this.updateUserInPosts(user)),
      concatMap(() => this.updateUserInComments(user)),
      concatMap(() => this.updateUserInReplies(user))
    );
  }

  updateUserInPosts(user: ProfileUser): Observable<void> {
    return this.backendservice.fetchData().pipe(
      map(posts => {
        const userPosts = posts.filter(post => post.userId === user.uid);

        userPosts.forEach(post => {
          post.profilepic = user.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

          if (user.username) {
            post.auth = user.username;
          }

          // Update the post in the database
          if (post.id) {
            this.backendservice.updatePost(post.id, post);
            console.log(post.profilepic);
          }
        });
      }),
      map(() => {}) // This is to ensure the method returns Observable<void>
    );
  }

  updateUserInComments(user: ProfileUser): Observable<void> {
    console.log('updateUserInComments is called');
    return this.backendservice.fetchData().pipe(
      map(posts => {
        console.log('posts:', posts);
        posts.forEach(post => {
          const userComments = post.comment.filter(comment => comment.userId === user.uid);
          console.log('userComments:', userComments);
          // Update the user data in each comment
          userComments.forEach(comment => {
            if(user.photoUrl){
              console.log('Updating profilepic:', comment.profilepic);
              comment.profilepic = user.photoUrl;
            }
            if(user.username){
              console.log('Updating commenter:', comment.commenter);
              comment.commenter = user.username;
            }
          });

          // Update the post in the database
          if (post.id) {
            console.log('Updating post:', post.id);
            this.backendservice.updatePost(post.id, post);
          }
        });
      }),
      map(() => {}) // This is to ensure the method returns Observable<void>
    );
  }
updateUserInReplies(user: ProfileUser): Observable<void> {
  return this.backendservice.fetchData().pipe(
    map(posts => {
      posts.forEach(post => {
        post.comment.forEach(comment => {
          const userReplies = comment.replies.filter(reply => reply.userId === user.uid);

          // Update the user data in each reply
          userReplies.forEach(reply => {
            if(user.photoUrl){
              reply.profilepic = user.photoUrl;
            }
            if(user.username){
              reply.username = user.username;
            }
          });
        });

        // Update the post in the database
        if (post.id) {
          this.backendservice.updatePost(post.id, post);
        }
      });
    }),
    map(() => {}) // This is to ensure the method returns Observable<void>
  );
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
        const docRef = doc(this.firestore, 'bookmarks', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bookmarkedPostIds = docSnap.data()['bookmarks'];
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

  followUser(currentUserId: string, userToFollowId: string): Promise<void> {
      const ref = doc(this.firestore, 'users', currentUserId);
      alert('Account Followed');
      return updateDoc(ref, { following: arrayUnion(userToFollowId) }).then(() => {
        this.followingChanged.next();
        location.reload();
      });

  }
getAllUsers() {
  return from(getDocs(collection(this.dab, 'users')).then((snapshot) => {
    return Promise.all(snapshot.docs.map(doc => {
      const user = { uid: doc.id, photoUrl: doc.data()['photoUrl'], username: doc.data()['username'], email: doc.data()['email'], ...doc.data() };
      return this.getStories(user.uid).then(stories => {
        return { ...user, stories };
      });
    }));
  }));
}
navigateToProfile(userId: string): void {
  if (userId) {
    this.router.navigate(['/profile', userId]);
    console.log(userId)
  }
}
async getUserById(userId: string): Promise<ProfileUser> {
  const userRef = doc(this.firestore, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as ProfileUser;
  } else {
    throw new Error('User not found');
  }
}
getStories(userId: string) {
  return getDocs(collection(this.dab, 'users', userId, 'stories')).then(snapshot => {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
}

getUserData(userId: string): Observable<ProfileUser> {
  const ref = doc(this.firestore, 'users', userId);
  return docData(ref).pipe(
    map(data => data as ProfileUser)
  );
}

unfollowUser(currentUserId: string, userToUnfollowId: string): Promise<void> {
  const ref = doc(this.firestore, 'users', currentUserId);
  return updateDoc(ref, { following: arrayRemove(userToUnfollowId) });
}
}
