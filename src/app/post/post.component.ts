import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from '../services/back-end.service';
import { Post, PostComment } from '../post.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() post?:Post;
  @Input()index:number = 0;
  newComment:string='';    
  constructor(private postService:PostService, private router:Router, private backendservice:BackEndService) { }
  
    ngOnInit(): void {
      console.log(this.post);
      console.log(this.index);
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
        this.backendservice.saveData();
      }
    }
    onUnlike(){
      
      if (this.post?.id) {
        this.postService.unlikePost(this.post.id);
      }
    }
    addComment(){
      if(this.newComment){
        this.post?.comment.push({likes:0,text: this.newComment, replies: []});
        this.newComment='';
        this.backendservice.saveData();
      }
      
    }
    replyToComment(comment: PostComment, reply: string) {
      comment.replies.push(reply);
      this.backendservice.saveData();
    }
    deleteComment(comment: PostComment) {
      const index = this.post?.comment.indexOf(comment);
  if (index !== undefined && index > -1) {
    this.post?.comment.splice(index, 1);
    this.backendservice.saveData();
      }
    }
    likeComment(comment: PostComment) {
      if (!comment.likes) {
        comment.likes = 0;
      }
      comment.likes++;
      this.backendservice.saveData();
    }
    }