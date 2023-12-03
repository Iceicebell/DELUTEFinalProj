import { Component, Input } from '@angular/core';
import { BackEndService } from '../services/back-end.service';
import { Post } from '../post.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() post?:Post;
  listofpost: Post[]=[];
  constructor(private postService: PostService, private backendservice:BackEndService) { }
  

  ngOnInit(): void {
    this.backendservice.fetchData().subscribe((posts)=>{
      this.listofpost=posts;
    });
    
  }
}