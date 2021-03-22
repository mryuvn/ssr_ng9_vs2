import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploaderTemplateComponent } from './files-uploader-template.component';

describe('FilesUploaderTemplateComponent', () => {
  let component: FilesUploaderTemplateComponent;
  let fixture: ComponentFixture<FilesUploaderTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesUploaderTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesUploaderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
