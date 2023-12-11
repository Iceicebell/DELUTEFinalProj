import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BackEndService } from '../services/back-end.service';
import { Post } from '../post.model';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';
import { ProfileUser } from '../models/user.profile';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})
export class PostAddComponent {
  user$: Observable<ProfileUser | null>;
  
  form!: FormGroup;
  id:string='';
  editmode= false;
  constructor(private postService:PostService,
     private router: Router,private actroute:ActivatedRoute,
      private backendservice:BackEndService,
       private authservice:AuthenticationService,
       private userService:UserService
    ){
    this.user$ = this.userService.currentUserProfile$;
  }

  ngOnInit():void{
    let title="";
    let imgPath='';
    let description='';
    this.actroute.params.subscribe((params:Params)=>{
  if(params['id']){
    this.id = params['id'];
    const postSpec = this.postService.getSpecPost(this.id);
    console.log('postSpec:', postSpec);  // Add this line
    if (postSpec) {
      title = postSpec.title;
      description = postSpec.description;
      imgPath = postSpec.img;
      this.editmode = true;
    } else {
     alert('error');
    }

  }
});
    this.form= new FormGroup({
      title:new FormControl(title, [Validators.required]),
      imgPath:new FormControl(imgPath, [Validators.required]),
      description:new FormControl(description, [Validators.required])
    });
  }
  onSubmit(){
    this.user$.subscribe(user => {
      if (user) {
        const like=this.form.value.like;
        const title = this.form.value.title || '';
        const imgPath = this.form.value.imgPath || '';
        const description = this.form.value.description || '';
        let profilepic = user.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        let auth = user.username || 'Anonymous';
        const post: Post = new Post(profilepic, title, imgPath, auth, description, new Date(), like);
        if(this.editmode==true){
          const existingPost = this.postService.getSpecPost(this.id);
          if (existingPost) {
            existingPost.title = title;
            existingPost.img = imgPath;
            existingPost.description = description;
            existingPost.profilepic = profilepic;
            existingPost.auth = auth;
            this.backendservice.updatePost(this.id, existingPost);
            alert("Post Edited");
          }
        }
        else{
          const like = this.form.value.like;
          const post: Post = new Post(profilepic, title, imgPath, auth, description, new Date(), like);
          this.postService.addPost(post);
          this.backendservice.saveData();
          alert("Post Created");
        }
        this.router.navigate(['post-list']);
      }
    });
  
}
}
  
 