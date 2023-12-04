import { Component, Input } from '@angular/core';
import { BackEndService } from '../services/back-end.service';
import { Post } from '../post.model';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  user$= this.authservice.currentUser$;
  @Input() post?:Post;
  listofpost: Post[]=[];
  constructor(private postService: PostService, private backendservice:BackEndService, private authservice:AuthenticationService, private router:Router, private userService:UserService) { }
  

  ngOnInit(): void {
    this.backendservice.fetchData().subscribe((posts)=>{
      this.listofpost=posts;
    });
    
  }
  logout(){
    this.authservice.logout().subscribe(()=>{
      this.router.navigate(['login']);
    });
  }
}