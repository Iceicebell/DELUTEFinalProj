import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Firestore, addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import 'firebase/firestore';
import { BehaviorSubject, Observable, take } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
@Injectable({
  providedIn: 'root'
})
export class StoryService {
  otherUsersStories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  currentUserStories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private authService: AuthenticationService) { }

  addStory(story: File) {
    const storage = getStorage();
    const storageRef = ref(storage, `stories/${story.name}`);

    const uploadTask = uploadBytesResumable(storageRef, story);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle the upload progress
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed', error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.authService.currentUser$.subscribe(user => {
            if (user) {
              const db = getFirestore();
              const storiesCollectionRef = collection(db, 'users', user.uid, 'stories');
              addDoc(storiesCollectionRef, { url: downloadURL, userId: user.uid });
              alert('Story Added');
            }
          });
        });
      }
    );
  }

  deleteStory(storyId: string, userId: string) {
    console.log(userId, storyId); // Add this line
    const db = getFirestore();
    const storyRef = doc(db, 'users', userId, 'stories', storyId);
    deleteDoc(storyRef);
  }
}
