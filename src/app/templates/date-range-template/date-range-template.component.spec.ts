import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeTemplateComponent } from './date-range-template.component';

describe('DateRangeTemplateComponent', () => {
  let component: DateRangeTemplateComponent;
  let fixture: ComponentFixture<DateRangeTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
