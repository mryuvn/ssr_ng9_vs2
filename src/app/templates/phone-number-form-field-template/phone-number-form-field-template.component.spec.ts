import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberFormFieldTemplateComponent } from './phone-number-form-field-template.component';

describe('PhoneNumberFormFieldTemplateComponent', () => {
  let component: PhoneNumberFormFieldTemplateComponent;
  let fixture: ComponentFixture<PhoneNumberFormFieldTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneNumberFormFieldTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberFormFieldTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
