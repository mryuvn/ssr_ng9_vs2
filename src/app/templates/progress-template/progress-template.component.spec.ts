import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTemplateComponent } from './progress-template.component';

describe('ProgressTemplateComponent', () => {
  let component: ProgressTemplateComponent;
  let fixture: ComponentFixture<ProgressTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
