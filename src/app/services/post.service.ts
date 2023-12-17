import { EventEmitter, Injectable } from '@angular/core';
import { Post } from '../post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  listChangeEvent: EventEmitter<Post[]>=new EventEmitter();
  listofpost:Post[]=[];
  getPost(){
    return this.listofpost;
  }
  addPost(post:Post){
    this.listofpost.push(post);
  }
  deletePost(id: string): void {
    const index = this.listofpost.findIndex(post => post.id === id);
    if (index !== -1) {
      this.listofpost.splice(index, 1);
    }
  }
  getSpecPost(id: string): Post | undefined {
    console.log('getSpecPost id:', id);  // Add this line
    console.log('listofpost:', this.listofpost);
    return this.listofpost.find(post => post.id === id);
  }
  hasUserLikedPost(id: string, userId: string): boolean {
    const post = this.listofpost.find(post => post.id === id);
    if (post) {
      if (!post.likedBy) {
        return false;
      }
      else {
        const hasUserLiked = post.likedBy.includes(userId);
        return hasUserLiked;
      }
    }
    return false;
  }
  updatePost(id: string, updatedPost: Post): void {
    const index = this.listofpost.findIndex(post => post.id === id);
    if (index !== -1) {
      this.listofpost[index] = updatedPost;
    }
  }
  likePost(id: string, userId: string): void {
    const post = this.listofpost.find(post => post.id === id);
    if (post) {
      if (!post.likedBy) {
        post.likedBy = [];
      }
      const userIndex = post.likedBy.indexOf(userId);
      if (userIndex > -1) {
        post.like -= 1;
        post.likedBy.splice(userIndex, 1);
      } else {
        post.like += 1;
        post.likedBy.push(userId);
      }
    }
  }
  unlikePost(id: string): void {
    const post = this.listofpost.find(post => post.id === id);
    if (post && post.like > 0) {
      post.like--;
    }
  }

  setPosts(listofpost:Post[]){
    this.listofpost = listofpost;
    this.listChangeEvent.emit(listofpost);
  }
  constructor() { }
}
