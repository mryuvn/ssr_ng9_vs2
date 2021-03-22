import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperTemplateComponent } from './image-cropper-template.component';

describe('ImageCropperTemplateComponent', () => {
  let component: ImageCropperTemplateComponent;
  let fixture: ComponentFixture<ImageCropperTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
