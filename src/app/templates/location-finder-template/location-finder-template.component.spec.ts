import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFinderTemplateComponent } from './location-finder-template.component';

describe('LocationFinderTemplateComponent', () => {
  let component: LocationFinderTemplateComponent;
  let fixture: ComponentFixture<LocationFinderTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationFinderTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFinderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
