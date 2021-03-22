import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewerTemplateComponent } from './album-viewer-template.component';

describe('AlbumViewerTemplateComponent', () => {
  let component: AlbumViewerTemplateComponent;
  let fixture: ComponentFixture<AlbumViewerTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumViewerTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumViewerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
