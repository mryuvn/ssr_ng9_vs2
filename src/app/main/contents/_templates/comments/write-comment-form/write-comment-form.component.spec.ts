import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteCommentFormComponent } from './write-comment-form.component';

describe('WriteCommentFormComponent', () => {
  let component: WriteCommentFormComponent;
  let fixture: ComponentFixture<WriteCommentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteCommentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
