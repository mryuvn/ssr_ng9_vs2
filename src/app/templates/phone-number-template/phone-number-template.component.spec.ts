import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberTemplateComponent } from './phone-number-template.component';

describe('PhoneNumberTemplateComponent', () => {
  let component: PhoneNumberTemplateComponent;
  let fixture: ComponentFixture<PhoneNumberTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneNumberTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
