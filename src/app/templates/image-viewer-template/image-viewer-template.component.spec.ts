import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerTemplateComponent } from './image-viewer-template.component';

describe('ImageViewerTemplateComponent', () => {
  let component: ImageViewerTemplateComponent;
  let fixture: ComponentFixture<ImageViewerTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageViewerTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageViewerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
