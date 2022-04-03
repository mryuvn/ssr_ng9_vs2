import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingTemplateComponent } from './processing-template.component';

describe('ProcessingTemplateComponent', () => {
  let component: ProcessingTemplateComponent;
  let fixture: ComponentFixture<ProcessingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
