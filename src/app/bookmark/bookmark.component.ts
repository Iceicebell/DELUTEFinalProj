import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { BookmarkPost } from '../models/bookmark.model';
import { Post } from '../post.model';
import { BackEndService } from '../services/back-end.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent {
  @Input()index:number = 0;
  newComment:string='';
  showComments = false; 
  postData: BookmarkPost[]=[];
  @Input()post?:Post;
  @Input() bookmark?:BookmarkPost;

  constructor(private userService: UserService,
    private backendservice:BackEndService,
    private postService:PostService,
    private router:Router
    ) {
      this.userService.currentUserProfile$.subscribe(user => {
        if (user) {
          from(this.userService.getBookmarkedPosts()).subscribe(data => {
            this.postData = data;
          });
        }
      });
  }
    onBookmarkPost(post: Post) {
      this.userService.addToBookmarks(post);
      alert("Added to Favorites");
    }

    onRemoveBookmarkPost(post: BookmarkPost) {
  this.userService.removeFromBookmarks(post).then(() => {
    alert("Removed from Favorites");
    location.reload();
  }).catch(error => {
    console.error('Error removing post from bookmarks: ', error);
  });
}
}
