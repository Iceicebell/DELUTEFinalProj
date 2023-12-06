import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from '../services/back-end.service';
import { Post, PostComment } from '../post.model';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';
import { ProfileUser } from '../models/user.profile';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  user$: Observable<ProfileUser | null>;
  @Input() post?:Post;
  @Input()index:number = 0;
  newComment:string='';  
  showComments = false;  
  constructor(private postService:PostService, 
    private router:Router, 
    private backendservice:BackEndService,
    private authservice:AuthenticationService,
    private userService:UserService) {
      this.user$ = this.userService.currentUserProfile$; }
  
    ngOnInit(): void {
      console.log(this.post);
      console.log(this.index);
    }
    toggleComments() {
      this.showComments = !this.showComments;
    }
    deleteButton(){
      if (this.post?.id) {
        this.postService.deletePost(this.post.id);
        this.backendservice.deleteButton(this.post.id);
      }
    }
    editButton(){
      if (this.post?.id) {
        this.router.navigate(['/post-edit', this.post.id]);
      }
    }
    onLike(){
      if (this.post?.id) {
        this.postService.likePost(this.post.id);
        this.backendservice.updatePost(this.post.id,this.post);
      }
    }
    onUnlike(){
      
      if (this.post?.id) {
        this.postService.unlikePost(this.post.id);
        this.backendservice.updatePost(this.post.id,this.post);
      }
    }
    addComment(){
      this.user$.subscribe(user => {
        if (user && this.newComment && this.post?.id) {
          this.post?.comment.push({
            likes: 0, 
            text: this.newComment, 
            replies: [], 
            commenter: user.username || 'Anonymous',
            profilepic: user.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          });
          this.newComment='';
          this.backendservice.updatePost(this.post.id, this.post);
        }
      });
    }

    replyToComment(comment: PostComment, reply: string) {
      this.user$.subscribe(user => {
        if (user) {
          comment.replies.push({
            username:  user.username|| 'Anonymous',
            profilepic: user.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            reply: reply
          });
          if (this.post?.id) {
            this.backendservice.updatePost(this.post.id, this.post);
          }
        }
      });
    }


    deleteComment(comment: PostComment) {
      const index = this.post?.comment.indexOf(comment);
  if (index !== undefined && index > -1) {
    this.post?.comment.splice(index, 1);
    if (this.post?.id) {
      this.backendservice.updatePost(this.post.id, this.post);
    }
  }
    }

    likeComment(comment: PostComment) {
      if (!comment.likes) {
        comment.likes = 0;
      }
      comment.likes++;
      if (this.post?.id) {
        this.backendservice.updatePost(this.post.id, this.post);
      }
    }
    onBookmarkPost(post: Post) {
      this.userService.addToBookmarks(post);
      alert("Added to Favorites");
    }
    
  }