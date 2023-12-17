import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDialogComponent } from './story-dialog.component';

describe('StoryDialogComponent', () => {
  let component: StoryDialogComponent;
  let fixture: ComponentFixture<StoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoryDialogComponent]
    });
    fixture = TestBed.createComponent(StoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
