import { Component, Input } from '@angular/core';
import { BackEndService } from '../services/back-end.service';
import { Post } from '../post.model';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ProfileUser } from '../models/user.profile';
import { MatDialog } from '@angular/material/dialog';
import { StoryService } from '../services/story.service';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  user$: Observable<ProfileUser | null>;
  peoples: any[] = [];
  @Input() post?:Post;
  listofpost: Post[]=[];
  currentUserStories: any[] = [];
  otherUsersStories: any[] = [];

  constructor(private postService: PostService,
    private backendservice:BackEndService,
    private authservice:AuthenticationService,
    private router:Router,
    private userService:UserService,
    private dialog: MatDialog,
    private storyService:StoryService) {

    this.user$ = this.userService.currentUserProfile$;

    this.backendservice.fetchData().subscribe((posts)=>{
      this.listofpost=posts;
    });
  }


  ngOnInit(): void {
    this.backendservice.fetchData().subscribe((posts)=>{
      this.listofpost=posts;
    });

    this.authservice.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        this.userService.getAllUsers().subscribe(users => {
          this.peoples = users.filter(user => user['uid'] !== currentUser['uid']);
          console.log(this.peoples); // Add this line
        });
      }
    });

    this.authservice.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        this.userService.getStories(currentUser['uid']).then(stories => {
          this.currentUserStories = stories;
          this.currentUserStories.sort((a, b) => b.timestamp - a.timestamp);
          console.log(this.currentUserStories);
        });
      }
    });
  }

  logout(){
    this.authservice.logout().subscribe(()=>{
      this.router.navigate(['login']);
    });
  }


  addStory(event: any): void {
    const story = event.target.files[0];
    this.storyService.addStory(story);
  }

  openStories(stories: any[]): void {
    this.authservice.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        const dialogRef = this.dialog.open(StoryDialogComponent, {
          data: { stories: stories, currentUserId: currentUser.uid }
        });

        dialogRef.componentInstance.deleteStoryEvent.subscribe(({ storyId, userId }) => {
          this.storyService.deleteStory(storyId, userId);
        });
      }
    });
  }
  openOtherStories(user: any): void {
    this.authservice.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        this.dialog.open(StoryDialogComponent, {
          data: {stories: user.stories, currentUserId: currentUser.uid }
        });
      }
    });
  }
}
