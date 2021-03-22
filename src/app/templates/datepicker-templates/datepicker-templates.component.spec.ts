import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerTemplatesComponent } from './datepicker-templates.component';

describe('DatepickerTemplatesComponent', () => {
  let component: DatepickerTemplatesComponent;
  let fixture: ComponentFixture<DatepickerTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
