import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BackEndService } from '../services/back-end.service';
import { Post } from '../post.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})
export class PostAddComponent {
  form!: FormGroup;
  id:string='';
  editmode= false;
  constructor(private postService:PostService, private router: Router,private actroute:ActivatedRoute, private backendservice:BackEndService){}

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
    const like=this.form.value.like;
    const title= this.form.value.title;
    const imgPath= this.form.value.imgPath;
    const description= this.form.value.description;
    const post: Post=new Post(title,imgPath,'icebell',description,new Date(),like);
    if(this.editmode==true){
      this.backendservice.updateEmployee(this.id,post);
      alert("Post Edited");
    }
    else{
      this.postService.addPost(post);
      this.backendservice.saveData();
      alert("Post Created");
    }
      this.router.navigate(['post-list'])
  }
  
}