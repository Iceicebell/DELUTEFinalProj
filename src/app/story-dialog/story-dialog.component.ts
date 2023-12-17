import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrls: ['./story-dialog.component.css']
})
export class StoryDialogComponent {

  currentPage=0;
  pageSize=1;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { stories: any[], currentUserId: string  }) {

  }

  ngOnInit(){
    console.log(this.data.stories);
  }
  get currentPageStories() {
    return this.data.stories.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }
  @Output() deleteStoryEvent = new EventEmitter<{storyId: string, userId: string}>();
}
